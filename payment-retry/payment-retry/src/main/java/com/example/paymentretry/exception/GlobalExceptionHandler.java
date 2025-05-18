package com.example.paymentretry.exception;

import com.example.paymentretry.payload.CustomApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<CustomApiResponse<String>> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
    }

    @ExceptionHandler(BadCredentialException.class)
    public ResponseEntity<CustomApiResponse<String>> handleBadCredentials(BadCredentialException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CustomApiResponse<String>> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred", false));
    }
}
