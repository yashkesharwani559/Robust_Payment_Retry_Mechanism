package com.example.paymentretry.service;

import com.example.paymentretry.exception.ResourceNotFoundException;
import com.example.paymentretry.exception.UnauthorisedAccess;
import com.example.paymentretry.model.RetryConfiguration;
import com.example.paymentretry.model.RetryStrategy;
import com.example.paymentretry.model.Transaction;
import com.example.paymentretry.model.TransactionStatus;
import com.example.paymentretry.payload.*;
import com.example.paymentretry.repository.PaymentMethodRepository;
import com.example.paymentretry.repository.RetryConfigurationRepository;
import com.example.paymentretry.repository.TransactionRepository;
import com.example.paymentretry.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);
    @Autowired
    private final TransactionRepository transactionRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PaymentMethodRepository paymentMethodRepository;
    @Autowired
    private final RetryConfigurationRepository retryConfigurationRepository;
    @Autowired
    private final PaymentService paymentService;

    @Value("${retry.max-attempts}")
    private Integer defaultMaxRetries;
    @Value("${retry.initial-interval}")
    private Long defaultRetryInterval;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, PaymentMethodRepository paymentMethodRepository, RetryConfigurationRepository retryConfigurationRepository, PaymentService paymentService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.paymentMethodRepository = paymentMethodRepository;
        this.retryConfigurationRepository = retryConfigurationRepository;
        this.paymentService = paymentService;
    }

    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest req) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        var pm = paymentMethodRepository.findById(req.getPaymentMethodId())
                .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod","id",req.getPaymentMethodId()));
        if (!pm.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("Cannot use payment method you do not own");
        }

        var tx = Transaction.builder()
                .user(user)
                .amount(req.getAmount())
                .currency(req.getCurrency())
                .status(TransactionStatus.PENDING)
                .gateway("DEFAULT_GATEWAY")
                .paymentMethodId(pm.getId())
                .build();
        tx = transactionRepository.save(tx);

        if (req.getAllowRetry()) {
            var rc = RetryConfiguration.builder()
                    .transaction(tx)
                    .maxRetries(defaultMaxRetries)
                    .retryInterval(defaultRetryInterval)
                    .strategy(RetryStrategy.EXPONENTIAL)
                    .currentAttempts(0)
                    .build();
            retryConfigurationRepository.save(rc);
        }

        paymentService.initiatePayment(tx);
        return mapToResponse(tx);
    }

    @Transactional
    public PagedResponse<TransactionResponse> getUserTransactions(
            Long userId, String status, int page, int size) {

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));

        Pageable pg = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> p;

        if (status != null && !status.isBlank()) {
            try {
                var st = TransactionStatus.valueOf(status.toUpperCase());
                p = transactionRepository.findByUserAndStatus(user, st, pg);
            } catch (IllegalArgumentException ex) {
                p = transactionRepository.findByUser(user, pg);
            }
        } else {
            p = transactionRepository.findByUser(user, pg);
        }

        var list = p.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                list, p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.isLast()
        );
    }

    @Transactional
    public TransactionResponse getTransactionById(Long userId, Long txId) {
        var tx = transactionRepository.findById(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction","id",txId));
        if (!tx.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("Cannot view transaction you do not own");
        }
        return mapToResponse(tx);
    }

    @Transactional
    public void manualRetry(Long userId, Long txId) {
        var tx = transactionRepository.findById(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction","id",txId));
        if (!tx.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("Cannot retry transaction you do not own");
        }
        if (tx.getStatus() != TransactionStatus.FAILED) {
            throw new IllegalStateException("Only failed transactions can be retried");
        }

        var rc = retryConfigurationRepository.findByTransaction(tx)
                .orElseThrow(() -> new ResourceNotFoundException("RetryConfiguration","txId",txId));
        if (rc.getCurrentAttempts() >= rc.getMaxRetries()) {
            throw new IllegalStateException("Max retry attempts reached");
        }

        tx.setStatus(TransactionStatus.RETRY_SCHEDULED);
        transactionRepository.save(tx);

        rc.setNextRetryTime(LocalDateTime.now());
        retryConfigurationRepository.save(rc);

        paymentService.retryPayment(tx);
    }

    @Transactional
    public PagedResponse<TransactionResponse> getAllTransactions(
            String status, Long userId, int page, int size) {

        Pageable pg = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> p;

        if (status != null && !status.isBlank() && userId != null) {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));
            try {
                var st = TransactionStatus.valueOf(status.toUpperCase());
                p = transactionRepository.findByUserAndStatus(user, st, pg);
            } catch (IllegalArgumentException ex) {
                p = transactionRepository.findByUser(user, pg);
            }

        } else if (status != null && !status.isBlank()) {
            try {
                var st = TransactionStatus.valueOf(status.toUpperCase());
                p = transactionRepository.findByStatus(st, pg);
            } catch (IllegalArgumentException ex) {
                p = transactionRepository.findAll(pg);
            }

        } else if (userId != null) {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User","id",userId));
            p = transactionRepository.findByUser(user, pg);

        } else {
            p = transactionRepository.findAll(pg);
        }

        var list = p.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                list, p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.isLast()
        );
    }

    private TransactionResponse mapToResponse(Transaction tx) {
        // PaymentMethodResponse and RetryConfigResponse can be null
        PaymentMethodResponse pmResp = null;
        if (tx.getPaymentMethodId() != null) {
            var opt = paymentMethodRepository.findById(tx.getPaymentMethodId());
            if (opt.isPresent()) {
                var pm = opt.get();
                pmResp = PaymentMethodResponse.builder()
                        .id(pm.getId())
                        .methodName(pm.getMethodName())
                        .details(pm.getDetails())
                        .priority(pm.getPriority())
                        .isDefault(pm.getDefault())
                        .build();
            }
        }

        RetryConfigResponse rcResp = null;
        var orc = retryConfigurationRepository.findByTransaction(tx);
        if (orc.isPresent()) {
            var rc = orc.get();
            rcResp = RetryConfigResponse.builder()
                    .id(rc.getId())
                    .maxRetries(rc.getMaxRetries())
                    .retryInterval(rc.getRetryInterval())
                    .strategy(rc.getStrategy())
                    .currentAttempts(rc.getCurrentAttempts())
                    .nextRetryTime(rc.getNextRetryTime())
                    .build();
        }

        return TransactionResponse.builder()
                .id(tx.getId())
                .amount(tx.getAmount())
                .currency(tx.getCurrency())
                .status(tx.getStatus())
                .gateway(tx.getGateway())
                .externalReferenceId(tx.getExternalReferenceId())
                .createdAt(tx.getCreatedAt())
                .updatedAt(tx.getUpdatedAt())
                .completedAt(tx.getCompletedAt())
                .paymentMethod(pmResp)
                .retryConfig(rcResp)
                .build();
    }
}
