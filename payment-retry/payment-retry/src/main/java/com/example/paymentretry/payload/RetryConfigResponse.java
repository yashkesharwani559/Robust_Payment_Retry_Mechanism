package com.example.paymentretry.payload;

import com.example.paymentretry.model.RetryStrategy;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Objects;

@Data
@Builder
public class RetryConfigResponse {
    private Long id;
    private Integer maxRetries;
    private Long retryInterval;
    private RetryStrategy strategy;
    private Integer currentAttempts;
    private LocalDateTime nextRetryTime;

    private RetryConfigResponse(Builder b) {
        this.id = b.id;
        this.maxRetries = b.maxRetries;
        this.retryInterval = b.retryInterval;
        this.strategy = b.strategy;
        this.currentAttempts = b.currentAttempts;
        this.nextRetryTime = b.nextRetryTime;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Integer maxRetries;
        private Long retryInterval;
        private RetryStrategy strategy;
        private Integer currentAttempts;
        private LocalDateTime nextRetryTime;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }
        public Builder maxRetries(Integer m) {
            this.maxRetries = m;
            return this;
        }
        public Builder retryInterval(Long i) {
            this.retryInterval = i;
            return this;
        }
        public Builder strategy(RetryStrategy s) {
            this.strategy = s;
            return this;
        }
        public Builder currentAttempts(Integer c) {
            this.currentAttempts = c;
            return this;
        }
        public Builder nextRetryTime(LocalDateTime t) {
            this.nextRetryTime = t;
            return this;
        }
        public RetryConfigResponse build() {
            return new RetryConfigResponse(this);
        }
    }

    // Getters
    public Long getId() { return id; }
    public Integer getMaxRetries() { return maxRetries; }
    public Long getRetryInterval() { return retryInterval; }
    public RetryStrategy getStrategy() { return strategy; }
    public Integer getCurrentAttempts() { return currentAttempts; }
    public LocalDateTime getNextRetryTime() { return nextRetryTime; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RetryConfigResponse)) return false;
        RetryConfigResponse that = (RetryConfigResponse) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(maxRetries, that.maxRetries) &&
                Objects.equals(retryInterval, that.retryInterval) &&
                strategy == that.strategy &&
                Objects.equals(currentAttempts, that.currentAttempts) &&
                Objects.equals(nextRetryTime, that.nextRetryTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, maxRetries, retryInterval, strategy, currentAttempts, nextRetryTime);
    }
}


