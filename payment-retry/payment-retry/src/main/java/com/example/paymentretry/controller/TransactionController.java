package com.example.paymentretry.controller;

import com.example.paymentretry.payload.*;
import com.example.paymentretry.security.UserDetailsImpl;
import com.example.paymentretry.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    @Autowired
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<CustomApiResponse<TransactionResponse>> createTransaction(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestBody @Valid TransactionRequest transactionRequest) {

        TransactionResponse resp = transactionService.createTransaction(
                currentUser.getId(), transactionRequest);
        return ResponseEntity.ok(
                CustomApiResponse.success(resp, "Transaction created", true)
        );
    }

    @GetMapping
    public ResponseEntity<CustomApiResponse<PagedResponse<TransactionResponse>>> getUserTransactions(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<TransactionResponse> pr = transactionService
                .getUserTransactions(currentUser.getId(), status, page, size);
        return ResponseEntity.ok(
                CustomApiResponse.success(pr, "Fetched user transactions", true)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<TransactionResponse>> getTransactionById(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {

        TransactionResponse resp = transactionService
                .getTransactionById(currentUser.getId(), id);
        return ResponseEntity.ok(
                CustomApiResponse.success(resp, "Fetched transaction", true)
        );
    }

    @PutMapping("/{id}/retry")
    public ResponseEntity<CustomApiResponse<MessageResponse>> manualRetry(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {

        transactionService.manualRetry(currentUser.getId(), id);
        return ResponseEntity.ok(
                CustomApiResponse.success(
                        new MessageResponse("Manual retry initiated successfully"),
                        "Retry scheduled", true
                )
        );
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CustomApiResponse<PagedResponse<TransactionResponse>>> getAllTransactions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PagedResponse<TransactionResponse> pr = transactionService
                .getAllTransactions(status, userId, page, size);
        return ResponseEntity.ok(
                CustomApiResponse.success(pr, "Fetched all transactions", true)
        );
    }
}
