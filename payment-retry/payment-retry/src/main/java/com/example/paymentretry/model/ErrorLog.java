package com.example.paymentretry.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "error_logs")
@Data
@Builder
public class ErrorLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transaction_id", nullable = false)
    private Transaction transaction;

    @Column(name = "error_code", nullable = false)
    private String errorCode;

    @Column(name = "error_message", nullable = false, columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_eligible")
    private Boolean retryEligible;

    @Column(name = "retry_attempt")
    private Integer retryAttempt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

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

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Boolean getRetryEligible() {
        return retryEligible;
    }

    public void setRetryEligible(Boolean retryEligible) {
        this.retryEligible = retryEligible;
    }

    public Integer getRetryAttempt() {
        return retryAttempt;
    }

    public void setRetryAttempt(Integer retryAttempt) {
        this.retryAttempt = retryAttempt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Constructors
    public ErrorLog() {}

    public ErrorLog(Long id, Transaction transaction, String errorCode, String errorMessage, Boolean retryEligible, Integer retryAttempt, LocalDateTime createdAt) {
        this.id = id;
        this.transaction = transaction;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.retryEligible = retryEligible;
        this.retryAttempt = retryAttempt;
        this.createdAt = createdAt;
    }

    // private constructor for builder
    private ErrorLog(Builder b) {
        this.id = b.id;
        this.transaction = b.transaction;
        this.errorCode = b.errorCode;
        this.errorMessage = b.errorMessage;
        this.retryEligible = b.retryEligible;
        this.retryAttempt  = b.retryAttempt;
        this.createdAt     = b.createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Transaction transaction;
        private String errorCode;
        private String errorMessage;
        private Boolean retryEligible;
        private Integer retryAttempt;
        private LocalDateTime createdAt;

        public Builder transaction(Transaction t) { this.transaction = t; return this; }
        public Builder errorCode(String c)         { this.errorCode = c;      return this; }
        public Builder errorMessage(String m)      { this.errorMessage = m;   return this; }
        public Builder retryEligible(Boolean r)    { this.retryEligible = r;  return this; }
        public Builder retryAttempt(Integer a)     { this.retryAttempt = a;   return this; }
        public Builder createdAt(LocalDateTime t)  { this.createdAt = t;      return this; }

        public ErrorLog build() {
            return new ErrorLog(this);
        }
    }
}
