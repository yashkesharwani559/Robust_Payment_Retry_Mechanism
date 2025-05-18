package com.example.paymentretry.model;

import jakarta.persistence.*;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "retry_configurations")
@Builder
public class RetryConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries;

    @Column(name = "retry_interval", nullable = false)
    private Long retryInterval;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RetryStrategy strategy;

    @Column(name = "current_attempts", nullable = false)
    private Integer currentAttempts;

    @Column(name = "next_retry_time")
    private LocalDateTime nextRetryTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public Long getRetryInterval() {
        return retryInterval;
    }

    public void setRetryInterval(Long retryInterval) {
        this.retryInterval = retryInterval;
    }

    public RetryStrategy getStrategy() {
        return strategy;
    }

    public void setStrategy(RetryStrategy strategy) {
        this.strategy = strategy;
    }

    public Integer getCurrentAttempts() {
        return currentAttempts;
    }

    public void setCurrentAttempts(Integer currentAttempts) {
        this.currentAttempts = currentAttempts;
    }

    public LocalDateTime getNextRetryTime() {
        return nextRetryTime;
    }

    public void setNextRetryTime(LocalDateTime nextRetryTime) {
        this.nextRetryTime = nextRetryTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Constructors
    public RetryConfiguration() {}

    public RetryConfiguration(Long id, Transaction transaction, Integer maxRetries, Long retryInterval, RetryStrategy strategy, Integer currentAttempts, LocalDateTime nextRetryTime, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.transaction = transaction;
        this.maxRetries = maxRetries;
        this.retryInterval = retryInterval;
        this.strategy = strategy;
        this.currentAttempts = currentAttempts;
        this.nextRetryTime = nextRetryTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    private RetryConfiguration(Builder b) {
        this.id = b.id;
        this.transaction = b.transaction;
        this.maxRetries = b.maxRetries;
        this.retryInterval = b.retryInterval;
        this.strategy = b.strategy;
        this.currentAttempts = b.currentAttempts;
        this.nextRetryTime = b.nextRetryTime;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Transaction transaction;
        private Integer maxRetries;
        private Long retryInterval;
        private RetryStrategy strategy;
        private Integer currentAttempts;
        private LocalDateTime nextRetryTime;

        public Builder id(Long i) { this.id = i; return this; }
        public Builder transaction(Transaction t) { this.transaction = t; return this; }
        public Builder maxRetries(Integer m) { this.maxRetries = m; return this; }
        public Builder retryInterval(Long i) { this.retryInterval = i; return this; }
        public Builder strategy(RetryStrategy s) { this.strategy = s; return this; }
        public Builder currentAttempts(Integer c) { this.currentAttempts = c; return this; }
        public Builder nextRetryTime(LocalDateTime n) { this.nextRetryTime = n; return this; }
        public RetryConfiguration build() { return new RetryConfiguration(this); }
    }

    // Getters and setters omitted for brevity

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RetryConfiguration)) return false;
        RetryConfiguration that = (RetryConfiguration) o;
        return Objects.equals(id, that.id);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
