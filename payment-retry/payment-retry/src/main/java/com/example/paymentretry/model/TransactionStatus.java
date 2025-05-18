package com.example.paymentretry.model;

public enum TransactionStatus {
    PENDING,
    SUCCESS,
    FAILED,
    RETRY_SCHEDULED,
    RETRY_IN_PROGRESS
}
