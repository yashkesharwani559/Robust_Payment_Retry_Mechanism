package com.example.paymentretry.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorLogResponse {
    private Long id;
    private Long transactionId;
    private String errorCode;
    private String errorMessage;
    private Boolean retryEligible;
    private Integer retryAttempt;
    private LocalDateTime createdAt;

    private ErrorLogResponse(Builder builder) {
        this.id = builder.id;
        this.transactionId = builder.transactionId;
        this.errorCode = builder.errorCode;
        this.errorMessage = builder.errorMessage;
        this.retryEligible = builder.retryEligible;
        this.retryAttempt = builder.retryAttempt;
        this.createdAt = builder.createdAt;
    }

    /**
     * Entry point for builder.
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder for ErrorLogResponse.
     */
    public static class Builder {
        private Long id;
        private Long transactionId;
        private String errorCode;
        private String errorMessage;
        private Boolean retryEligible;
        private Integer retryAttempt;
        private LocalDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder transactionId(Long transactionId) {
            this.transactionId = transactionId;
            return this;
        }

        public Builder errorCode(String errorCode) {
            this.errorCode = errorCode;
            return this;
        }

        public Builder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public Builder retryEligible(Boolean retryEligible) {
            this.retryEligible = retryEligible;
            return this;
        }

        public Builder retryAttempt(Integer retryAttempt) {
            this.retryAttempt = retryAttempt;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ErrorLogResponse build() {
            return new ErrorLogResponse(this);
        }
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public Boolean getRetryEligible() {
        return retryEligible;
    }

    public Integer getRetryAttempt() {
        return retryAttempt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ErrorLogResponse)) return false;
        ErrorLogResponse that = (ErrorLogResponse) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(transactionId, that.transactionId) &&
                Objects.equals(errorCode, that.errorCode) &&
                Objects.equals(errorMessage, that.errorMessage) &&
                Objects.equals(retryEligible, that.retryEligible) &&
                Objects.equals(retryAttempt, that.retryAttempt) &&
                Objects.equals(createdAt, that.createdAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, transactionId, errorCode, errorMessage, retryEligible, retryAttempt, createdAt);
    }
}
