package com.example.paymentretry.service;

import com.example.paymentretry.model.RetryConfiguration;
import com.example.paymentretry.model.Transaction;
import com.example.paymentretry.model.TransactionStatus;
import com.example.paymentretry.repository.RetryConfigurationRepository;
import com.example.paymentretry.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RetrySchedulerService {
    private static final Logger logger = LoggerFactory.getLogger(RetrySchedulerService.class);
    @Autowired
    private final RetryConfigurationRepository retryConfigurationRepository;
    @Autowired
    private final TransactionRepository transactionRepository;
    @Autowired
    private final PaymentService paymentService;

    // Track in-progress retries to avoid duplicates
    private final ConcurrentHashMap<Long, Boolean> inProgress = new ConcurrentHashMap<>();
    private final AtomicInteger activeCount = new AtomicInteger(0);

    public RetrySchedulerService(RetryConfigurationRepository retryConfigurationRepository, TransactionRepository transactionRepository, PaymentService paymentService) {
        this.retryConfigurationRepository = retryConfigurationRepository;
        this.transactionRepository = transactionRepository;
        this.paymentService = paymentService;
    }

    /**
     * Scheduled job runs every minute (configurable), finds eligible retries, and processes them.
     */
    @Scheduled(fixedDelayString = "${retry.scheduler.interval:60000}")
    public void processScheduledRetries() {
        logger.info("Scheduled retry job started. Active retries: {}", activeCount.get());

        var statuses = List.of(
                TransactionStatus.RETRY_SCHEDULED,
                TransactionStatus.FAILED
        );
        List<RetryConfiguration> pending = retryConfigurationRepository
                .findEligiblePendingRetries(LocalDateTime.now(), statuses);
        logger.info("Found {} eligible retries", pending.size());

        for (var cfg : pending) {
            Long txId = cfg.getTransaction().getId();
            if (inProgress.putIfAbsent(txId, Boolean.TRUE) != null) {
                logger.debug("Skipping tx {} as it's already in progress", txId);
                continue;
            }
            activeCount.incrementAndGet();

            Thread.startVirtualThread(() -> {
                try {
                    handleRetry(cfg);
                } catch (Exception ex) {
                    logger.error("Error processing retry for tx {}", txId, ex);
                } finally {
                    inProgress.remove(txId);
                    activeCount.decrementAndGet();
                }
            });
        }
        logger.info("Scheduled retry job dispatched. Active retries: {}", activeCount.get());
    }

    @Transactional
    protected void handleRetry(RetryConfiguration cfg) {
        Transaction tx = cfg.getTransaction();
        logger.info("Processing retry for tx {} (attempt {}/{})",
                tx.getId(), cfg.getCurrentAttempts()+1, cfg.getMaxRetries());

        tx.setStatus(TransactionStatus.RETRY_IN_PROGRESS);
        transactionRepository.save(tx);

        cfg.setCurrentAttempts(cfg.getCurrentAttempts() + 1);
        retryConfigurationRepository.save(cfg);

        try {
            paymentService.retryPayment(tx);
            logger.info("Retry sent for tx {}", tx.getId());
        } catch (Exception ex) {
            logger.error("Retry failed for tx {}", tx.getId(), ex);
            tx.setStatus(TransactionStatus.FAILED);
            transactionRepository.save(tx);
        }
    }
}
