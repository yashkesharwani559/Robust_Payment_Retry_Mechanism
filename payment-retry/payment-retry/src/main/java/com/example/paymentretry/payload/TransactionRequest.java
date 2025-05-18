package com.example.paymentretry.payload;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    @NotNull
    private Long paymentMethodId;
    @NotNull @DecimalMin("0.01") private BigDecimal amount;
    @NotBlank
    private String currency;
    private Boolean allowRetry = false;

    public @NotNull Long getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(@NotNull Long paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public @NotNull @DecimalMin("0.01") BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(@NotNull @DecimalMin("0.01") BigDecimal amount) {
        this.amount = amount;
    }

    public @NotBlank String getCurrency() {
        return currency;
    }

    public void setCurrency(@NotBlank String currency) {
        this.currency = currency;
    }

    public Boolean getAllowRetry() {
        return allowRetry;
    }

    public void setAllowRetry(Boolean allowRetry) {
        this.allowRetry = allowRetry;
    }
}
