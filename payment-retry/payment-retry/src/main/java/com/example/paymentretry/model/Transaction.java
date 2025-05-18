package com.example.paymentretry.model;

import jakarta.persistence.*;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "transactions")
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(nullable = false)
    private String gateway;

    @Column(name = "external_reference_id")
    private String externalReferenceId;

    @Column(name = "payment_method_id")
    private Long paymentMethodId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public String getGateway() {
        return gateway;
    }

    public void setGateway(String gateway) {
        this.gateway = gateway;
    }

    public String getExternalReferenceId() {
        return externalReferenceId;
    }

    public void setExternalReferenceId(String externalReferenceId) {
        this.externalReferenceId = externalReferenceId;
    }

    public Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    // Constructors
    public Transaction() {}

    public Transaction(Long id, User user, BigDecimal amount, String currency, TransactionStatus status, String gateway, String externalReferenceId, Long paymentMethodId, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime completedAt) {
        this.id = id;
        this.user = user;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.gateway = gateway;
        this.externalReferenceId = externalReferenceId;
        this.paymentMethodId = paymentMethodId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.completedAt = completedAt;
    }

    private Transaction(Builder b) {
        this.id = b.id;
        this.user = b.user;
        this.amount = b.amount;
        this.currency = b.currency;
        this.status = b.status;
        this.gateway = b.gateway;
        this.externalReferenceId = b.externalReferenceId;
        this.paymentMethodId = b.paymentMethodId;
        this.createdAt = b.createdAt;
        this.updatedAt = b.updatedAt;
        this.completedAt = b.completedAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private User user;
        private BigDecimal amount;
        private String currency;
        private TransactionStatus status;
        private String gateway;
        private String externalReferenceId;
        private Long paymentMethodId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime completedAt;

        public Builder id(Long i) { this.id = i; return this; }
        public Builder user(User u) { this.user = u; return this; }
        public Builder amount(BigDecimal a) { this.amount = a; return this; }
        public Builder currency(String c) { this.currency = c; return this; }
        public Builder status(TransactionStatus s) { this.status = s; return this; }
        public Builder gateway(String g) { this.gateway = g; return this; }
        public Builder externalReferenceId(String e) { this.externalReferenceId = e; return this; }
        public Builder paymentMethodId(Long p) { this.paymentMethodId = p; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u) { this.updatedAt = u; return this; }
        public Builder completedAt(LocalDateTime c) { this.completedAt = c; return this; }
        public Transaction build() { return new Transaction(this); }
    }

    // Getters and setters omitted for brevity

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Transaction)) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(id, that.id);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
