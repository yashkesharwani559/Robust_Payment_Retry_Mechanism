package com.example.paymentretry.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentCallbackRequest {
    @NotBlank
    private String externalReferenceId;

    @NotBlank
    private String status;            // e.g. "SUCCESS" or "FAILED"

    // only present on failure
    private String errorCode;
    private String errorMessage;

    @NotNull
    private Long timestamp;           // epoch millis

    public @NotBlank String getExternalReferenceId() {
        return externalReferenceId;
    }

    public void setExternalReferenceId(@NotBlank String externalReferenceId) {
        this.externalReferenceId = externalReferenceId;
    }

    public @NotBlank String getStatus() {
        return status;
    }

    public void setStatus(@NotBlank String status) {
        this.status = status;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public @NotNull Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(@NotNull Long timestamp) {
        this.timestamp = timestamp;
    }
}
