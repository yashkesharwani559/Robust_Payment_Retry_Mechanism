package com.example.paymentretry.payload;

import org.springframework.http.HttpStatus;

public class CustomApiResponse<T> {
    private Boolean success;
    private HttpStatus status;
    private String message;
    private T data;

    public CustomApiResponse(HttpStatus status, String message, T data, Boolean success) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.success = success;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public static <T> CustomApiResponse<T> success(T data, String message, Boolean success) {
        return new CustomApiResponse<>(HttpStatus.OK, message, data, success);
    }

    public static <T> CustomApiResponse<T> error(HttpStatus status, String message, Boolean success) {
        return new CustomApiResponse<>(status, message, null, success);
    }

}
