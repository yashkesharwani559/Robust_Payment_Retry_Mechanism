package com.example.paymentretry.controller;

import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.MessageResponse;
import com.example.paymentretry.payload.PaymentCallbackRequest;
import com.example.paymentretry.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    @Autowired
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/callback")
    public ResponseEntity<CustomApiResponse<MessageResponse>> handlePaymentCallback(
            @Valid @RequestBody PaymentCallbackRequest callbackRequest) {

        paymentService.processPaymentCallback(callbackRequest);
        MessageResponse msg = new MessageResponse("Callback processed successfully");
        return ResponseEntity.ok(CustomApiResponse.success(msg, msg.getMessage(), true));
    }
}
