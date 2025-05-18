package com.example.paymentretry.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
public class PaymentMethodResponse {
    private Long id;
    private String methodName;
    private String details;
    private Integer priority;
    private Boolean isDefault;

    public PaymentMethodResponse(Long id, String methodName, String details, Integer priority, Boolean isDefault) {
        this.id = id;
        this.methodName = methodName;
        this.details = details;
        this.priority = priority;
        this.isDefault = isDefault;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    private PaymentMethodResponse(Builder builder) {
        this.id = builder.id;
        this.methodName = builder.methodName;
        this.details = builder.details;
        this.priority = builder.priority;
        this.isDefault = builder.isDefault;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PaymentMethodResponse)) return false;
        PaymentMethodResponse that = (PaymentMethodResponse) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(methodName, that.methodName) &&
                Objects.equals(details, that.details) &&
                Objects.equals(priority, that.priority) &&
                Objects.equals(isDefault, that.isDefault);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, methodName, details, priority, isDefault);
    }

    @Override
    public String toString() {
        return "PaymentMethodResponse{" +
                "id=" + id +
                ", methodName='" + methodName + '\'' +
                ", details='" + details + '\'' +
                ", priority=" + priority +
                ", isDefault=" + isDefault +
                '}';
    }

    /**
     * Returns a new Builder instance.
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder for PaymentMethodResponse.
     */
    public static class Builder {
        private Long id;
        private String methodName;
        private String details;
        private Integer priority;
        private Boolean isDefault;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder methodName(String methodName) {
            this.methodName = methodName;
            return this;
        }

        public Builder details(String details) {
            this.details = details;
            return this;
        }

        public Builder priority(Integer priority) {
            this.priority = priority;
            return this;
        }

        public Builder isDefault(Boolean isDefault) {
            this.isDefault = isDefault;
            return this;
        }

        public PaymentMethodResponse build() {
            return new PaymentMethodResponse(this);
        }
    }
}
