package com.example.paymentretry.payload;

import com.example.paymentretry.model.TransactionStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private BigDecimal amount;
    private String currency;
    private TransactionStatus status;
    private String gateway;
    private String externalReferenceId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private PaymentMethodResponse paymentMethod;
    private RetryConfigResponse retryConfig;

    private TransactionResponse(Builder b) {
        this.id = b.id;
        this.amount = b.amount;
        this.currency = b.currency;
        this.status = b.status;
        this.gateway = b.gateway;
        this.externalReferenceId = b.externalReferenceId;
        this.createdAt = b.createdAt;
        this.updatedAt = b.updatedAt;
        this.completedAt = b.completedAt;
        this.paymentMethod = b.paymentMethod;
        this.retryConfig = b.retryConfig;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private BigDecimal amount;
        private String currency;
        private TransactionStatus status;
        private String gateway;
        private String externalReferenceId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime completedAt;
        private PaymentMethodResponse paymentMethod;
        private RetryConfigResponse retryConfig;

        public Builder id(Long i) { this.id = i; return this; }
        public Builder amount(BigDecimal a) { this.amount = a; return this; }
        public Builder currency(String c) { this.currency = c; return this; }
        public Builder status(TransactionStatus s) { this.status = s; return this; }
        public Builder gateway(String g) { this.gateway = g; return this; }
        public Builder externalReferenceId(String e) { this.externalReferenceId = e; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u) { this.updatedAt = u; return this; }
        public Builder completedAt(LocalDateTime c) { this.completedAt = c; return this; }
        public Builder paymentMethod(PaymentMethodResponse p) { this.paymentMethod = p; return this; }
        public Builder retryConfig(RetryConfigResponse r) { this.retryConfig = r; return this; }
        public TransactionResponse build() { return new TransactionResponse(this); }
    }

    // Getters
    public Long getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public TransactionStatus getStatus() { return status; }
    public String getGateway() { return gateway; }
    public String getExternalReferenceId() { return externalReferenceId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public PaymentMethodResponse getPaymentMethod() { return paymentMethod; }
    public RetryConfigResponse getRetryConfig() { return retryConfig; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TransactionResponse)) return false;
        TransactionResponse that = (TransactionResponse) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
