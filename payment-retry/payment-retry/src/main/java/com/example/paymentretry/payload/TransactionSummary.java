package com.example.paymentretry.payload;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionSummary(
        Long id,
        String status,
        String currency,
        BigDecimal amount,
        LocalDateTime createdAt,
        String paymentMethod,
        int retryAttempts,
        int maxRetries
) {
}
