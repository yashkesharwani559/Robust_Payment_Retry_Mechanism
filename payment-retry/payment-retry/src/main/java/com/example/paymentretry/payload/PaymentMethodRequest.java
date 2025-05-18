package com.example.paymentretry.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentMethodRequest {
    @NotBlank
    private String methodName;

    @NotBlank
    private String details;

    @NotNull
    private Integer priority;

    private Boolean isDefault = false;

    public @NotBlank String getMethodName() {
        return methodName;
    }

    public void setMethodName(@NotBlank String methodName) {
        this.methodName = methodName;
    }

    public @NotBlank String getDetails() {
        return details;
    }

    public void setDetails(@NotBlank String details) {
        this.details = details;
    }

    public @NotNull Integer getPriority() {
        return priority;
    }

    public void setPriority(@NotNull Integer priority) {
        this.priority = priority;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }
}
