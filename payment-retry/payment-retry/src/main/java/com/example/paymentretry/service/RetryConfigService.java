package com.example.paymentretry.service;

import com.example.paymentretry.exception.ResourceNotFoundException;
import com.example.paymentretry.model.RetryConfiguration;
import com.example.paymentretry.model.Transaction;
import com.example.paymentretry.payload.RetryConfigRequest;
import com.example.paymentretry.payload.RetryConfigResponse;
import com.example.paymentretry.repository.RetryConfigurationRepository;
import com.example.paymentretry.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RetryConfigService {
    private static final Logger logger = LoggerFactory.getLogger(RetryConfigService.class);
    @Autowired
    private final RetryConfigurationRepository retryConfigurationRepository;
    @Autowired
    private final TransactionRepository transactionRepository;

    @Value("${retry.max-attempts}")
    private Integer defaultMaxRetries;

    @Value("${retry.initial-interval}")
    private Long defaultRetryInterval;

    @Autowired
    public RetryConfigService(RetryConfigurationRepository retryConfigurationRepository, TransactionRepository transactionRepository) {
        this.retryConfigurationRepository = retryConfigurationRepository;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Update global retry settings (max attempts and initial interval).
     * Only ADMIN should invoke.
     */
    @Transactional
    public void updateGlobalRetryConfig(RetryConfigRequest req) {
        logger.info("Updating global retry config: maxRetries={}, retryInterval={}",
                req.getMaxRetries(), req.getRetryInterval());
        if (req.getMaxRetries() < 0 || req.getRetryInterval() < 0) {
            throw new IllegalArgumentException("Retry parameters must be non-negative");
        }
        this.defaultMaxRetries = req.getMaxRetries();
        this.defaultRetryInterval = req.getRetryInterval();
        logger.info("Global retry config updated successfully");
    }

    /**
     * Fetch current global retry settings.
     */
    public RetryConfigResponse getGlobalRetryConfig() {
        return RetryConfigResponse.builder()
                .maxRetries(defaultMaxRetries)
                .retryInterval(defaultRetryInterval)
                .build();
    }

    /**
     * Update or create retry config for a specific transaction.
     */
    @Transactional
    public RetryConfigResponse updateTransactionRetryConfig(Long txId, RetryConfigRequest req) {
        logger.info("Updating retry config for transaction {}: {}", txId, req);
        if (req.getMaxRetries() < 0 || req.getRetryInterval() < 0) {
            throw new IllegalArgumentException("Retry parameters must be non-negative");
        }

        Transaction tx = transactionRepository.findById(txId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", txId));

        RetryConfiguration cfg = retryConfigurationRepository.findByTransaction(tx)
                .orElseGet(() -> {
                    var newCfg = RetryConfiguration.builder()
                            .transaction(tx)
                            .currentAttempts(0)
                            .build();
                    return newCfg;
                });

        cfg.setMaxRetries(req.getMaxRetries());
        cfg.setRetryInterval(req.getRetryInterval());
        cfg.setStrategy(req.getStrategy());

        cfg = retryConfigurationRepository.save(cfg);
        logger.info("Transaction retry config saved for tx {}: {} attempts, interval {}",
                txId, cfg.getMaxRetries(), cfg.getRetryInterval());

        return RetryConfigResponse.builder()
                .id(cfg.getId())
                .maxRetries(cfg.getMaxRetries())
                .retryInterval(cfg.getRetryInterval())
                .strategy(cfg.getStrategy())
                .currentAttempts(cfg.getCurrentAttempts())
                .nextRetryTime(cfg.getNextRetryTime())
                .build();
    }
}
