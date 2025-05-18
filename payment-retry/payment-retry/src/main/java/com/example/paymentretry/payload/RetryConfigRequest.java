package com.example.paymentretry.payload;

import com.example.paymentretry.model.RetryStrategy;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RetryConfigRequest {
    @NotNull
    @Min(1)
    @Max(10)
    private Integer maxRetries;

    @NotNull
    @Min(30000) // Minimum 30 seconds
    private Long retryInterval;

    @NotNull
    private RetryStrategy strategy;

    public @NotNull @Min(1) @Max(10) Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(@NotNull @Min(1) @Max(10) Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public @NotNull @Min(30000) Long getRetryInterval() {
        return retryInterval;
    }

    public void setRetryInterval(@NotNull @Min(30000) Long retryInterval) {
        this.retryInterval = retryInterval;
    }

    public @NotNull RetryStrategy getStrategy() {
        return strategy;
    }

    public void setStrategy(@NotNull RetryStrategy strategy) {
        this.strategy = strategy;
    }
}
