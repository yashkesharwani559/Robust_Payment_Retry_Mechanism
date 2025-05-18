package com.example.paymentretry.service;

import com.example.paymentretry.exception.ResourceNotFoundException;
import com.example.paymentretry.model.*;
import com.example.paymentretry.payload.PaymentCallbackRequest;
import com.example.paymentretry.repository.ErrorLogRepository;
import com.example.paymentretry.repository.RetryConfigurationRepository;
import com.example.paymentretry.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    @Autowired
    private final TransactionRepository transactionRepository;
    @Autowired
    private final RetryConfigurationRepository retryConfigurationRepository;
    @Autowired
    private final ErrorLogRepository errorLogRepository;
    @Autowired
    private final RabbitTemplate rabbitTemplate;
    @Autowired
    private final RestTemplate restTemplate;

    @Value("${payment.gateway.url}")
    private String gatewayUrl;

    @Value("${payment.gateway.apiKey}")
    private String gatewayApiKey;

    @Value("${queue.payment.retry}")
    private String retryQueue;

    @Value("${queue.payment.notification}")
    private String notificationQueue;

    public PaymentService(
            TransactionRepository transactionRepository,
            RetryConfigurationRepository retryConfigurationRepository,
            ErrorLogRepository errorLogRepository,
            RabbitTemplate rabbitTemplate,
            RestTemplate restTemplate
    ) {
        this.transactionRepository = transactionRepository;
        this.retryConfigurationRepository = retryConfigurationRepository;
        this.errorLogRepository = errorLogRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.restTemplate = restTemplate;
    }

    /**
     * Kicks off a new payment: generates reference, persists, then async-calls the gateway.
     */
    @Transactional
    public void initiatePayment(Transaction tx) {
        String externalRef = UUID.randomUUID().toString();
        tx.setExternalReferenceId(externalRef);
        transactionRepository.save(tx);
        logger.info("Initiating payment for tx {} with ref {}", tx.getId(), externalRef);

        CompletableFuture.runAsync(() -> {
            try {
                // TODO: replace with real API call
                simulatePaymentProcessing(tx);
            } catch (Exception ex) {
                logger.error("Async initiatePayment error for tx {}: {}", tx.getId(), ex.getMessage(), ex);
                handlePaymentError(tx, "ASYNC_INIT_ERROR", ex.getMessage());
            }
        });
    }

    /**
     * Called for a manual or scheduled retry.
     * Does *not* reset attempts—caller should increment before calling.
     */
    @Transactional
    public void retryPayment(Transaction tx) {
        logger.info("Retrying payment for tx {} (attempt {})",
                tx.getId(),
                retryConfigurationRepository.findByTransaction(tx)
                        .map(RetryConfiguration::getCurrentAttempts).orElse(0));

        // update status
        tx.setStatus(TransactionStatus.RETRY_IN_PROGRESS);
        transactionRepository.save(tx);

        CompletableFuture.runAsync(() -> {
            try {
                simulatePaymentProcessing(tx);
            } catch (Exception ex) {
                logger.error("Async retryPayment error for tx {}: {}", tx.getId(), ex.getMessage(), ex);
                handlePaymentError(tx, "ASYNC_RETRY_ERROR", ex.getMessage());
            }
        });
    }

    /**
     * Handles the gateway callback.  Marks success/failure, logs errors,
     * and schedules retries if eligible.
     */
    @Transactional
    public void processPaymentCallback(PaymentCallbackRequest cb) {
        Transaction tx = transactionRepository
                .findByExternalReferenceId(cb.getExternalReferenceId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Transaction", "externalReferenceId", cb.getExternalReferenceId()));

        LocalDateTime callbackTime = Instant.ofEpochMilli(cb.getTimestamp())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        if ("SUCCESS".equalsIgnoreCase(cb.getStatus())) {
            tx.setStatus(TransactionStatus.SUCCESS);
            tx.setCompletedAt(callbackTime);

        } else {
            tx.setStatus(TransactionStatus.FAILED);

            ErrorLog log = ErrorLog.builder()
                    .transaction(tx)
                    .errorCode(cb.getErrorCode())
                    .errorMessage(cb.getErrorMessage())
                    .retryEligible(isRetryEligible(cb.getErrorCode()))
                    .retryAttempt(
                            retryConfigurationRepository.findByTransaction(tx)
                                    .map(RetryConfiguration::getCurrentAttempts).orElse(0)
                    )
                    .build();
            errorLogRepository.save(log);

            if (isRetryEligible(cb.getErrorCode())) {
                retryConfigurationRepository.findByTransaction(tx).ifPresent(rc -> {
                    if (rc.getCurrentAttempts() < rc.getMaxRetries()) {
                        tx.setStatus(TransactionStatus.RETRY_SCHEDULED);
                        // update nextRetryTime here or leave to scheduler
                        retryConfigurationRepository.save(rc);
                    }
                });
            }
        }

        transactionRepository.save(tx);
        rabbitTemplate.convertAndSend(notificationQueue, tx.getId());
    }

    // --- Helper methods below ---

    private boolean isRetryEligible(String err) {
        return err != null && (err.startsWith("NETWORK_")
                || err.equals("GATEWAY_TIMEOUT")
                || err.equals("TEMPORARY_FAILURE"));
    }

    private void handlePaymentError(Transaction tx, String code, String msg) {
        tx.setStatus(TransactionStatus.FAILED);
        transactionRepository.save(tx);

        ErrorLog log = ErrorLog.builder()
                .transaction(tx)
                .errorCode(code)
                .errorMessage(msg)
                .retryEligible(isRetryEligible(code))
                .retryAttempt(
                        retryConfigurationRepository.findByTransaction(tx)
                                .map(RetryConfiguration::getCurrentAttempts).orElse(0)
                )
                .build();
        errorLogRepository.save(log);
    }

    /** Simulation only—replace with real gateway call. */
    private void simulatePaymentProcessing(Transaction tx) {
        boolean success = Math.random() > 0.3;
        if (success) {
            tx.setStatus(TransactionStatus.SUCCESS);
            tx.setCompletedAt(LocalDateTime.now());
        } else {
            String[] codes = {"NETWORK_ERROR","INSUFFICIENT_FUNDS","GATEWAY_TIMEOUT"};
            String code = codes[(int)(Math.random()*codes.length)];
            handlePaymentError(tx, code, "Simulated " + code);
        }
        transactionRepository.save(tx);
    }
}
