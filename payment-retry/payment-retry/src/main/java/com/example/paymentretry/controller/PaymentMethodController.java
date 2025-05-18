package com.example.paymentretry.controller;

import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.MessageResponse;
import com.example.paymentretry.payload.PaymentMethodRequest;
import com.example.paymentretry.service.PaymentMethodService;
import com.example.paymentretry.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodController {
    private final Logger logger = LoggerFactory.getLogger(PaymentMethodController.class);

    @Autowired
    private PaymentMethodService paymentMethodService;

    // Add a new payment method
    @PostMapping
    public ResponseEntity<CustomApiResponse<?>> addPaymentMethod(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @Valid @RequestBody PaymentMethodRequest paymentMethodRequest) {
        return ResponseEntity.ok(paymentMethodService.addPaymentMethod(currentUser.getId(), paymentMethodRequest));
    }

    // Get all payment methods for the current user
    @GetMapping
    public ResponseEntity<CustomApiResponse<?>> getUserPaymentMethods(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        logger.info("currentUser id={}, email={}, role={}",
                currentUser.getId(),
                currentUser.getUsername(),  // you return email as username
                currentUser.getRole());

        return ResponseEntity.ok(paymentMethodService.getUserPaymentMethods(currentUser.getId()));
    }

    // Get payment method by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<?>> getPaymentMethodById(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        return ResponseEntity.ok(paymentMethodService.getPaymentMethodById(currentUser.getId(), id));
    }

    // Update an existing payment method
    @PutMapping("/{id}")
    public ResponseEntity<CustomApiResponse<?>> updatePaymentMethod(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id,
            @Valid @RequestBody PaymentMethodRequest paymentMethodRequest) {
        return ResponseEntity.ok(paymentMethodService.updatePaymentMethod(currentUser.getId(), id, paymentMethodRequest));
    }

    // Delete a payment method
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePaymentMethod(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(currentUser.getId(), id);
        return ResponseEntity.ok(new MessageResponse("Payment method deleted successfully"));
    }
}
