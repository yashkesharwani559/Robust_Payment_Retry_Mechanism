package com.example.paymentretry.controller;

import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.TransactionSummary;
import com.example.paymentretry.service.TransactionAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @Autowired
    private final TransactionAnalyticsService analyticsService;

    public AnalyticsController(TransactionAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/transactions/trend")
    public ResponseEntity<CustomApiResponse<List<Map<String, Object>>>> getTransactionTrend(
            @RequestParam(defaultValue = "7") int days) {
        return analyticsService.getTransactionTrendForLastDays(days);
    }

    /**
     * ADMIN only: overall retry success rate.
     */
    @GetMapping("/retry/success-rate")
    public ResponseEntity<CustomApiResponse<Double>> getRetrySuccessRate() {
        return analyticsService.getRetrySuccessRate();
    }

    /**
     * ADMIN only: top N common error codes.
     */
    @GetMapping("/errors/common")
    public ResponseEntity<CustomApiResponse<List<Map<String, Object>>>> getMostCommonErrors(
            @RequestParam(defaultValue = "5") int limit) {
        return analyticsService.getMostCommonErrorCodes(limit);
    }

    /**
     * USER or ADMIN: recent transaction summaries for the current user.
     */
    @GetMapping("/transactions/summary")
    public ResponseEntity<CustomApiResponse<List<TransactionSummary>>> getTransactionSummary(
            @AuthenticationPrincipal(expression = "id") Long currentUserId,
            @RequestParam(defaultValue = "10") int limit) {
        return analyticsService.getTransactionSummariesForUser(currentUserId, limit);
    }

    /**
     * ADMIN only: average retry attempts for successful transactions.
     */
    @GetMapping("/retry/avg-attempts")
    public ResponseEntity<CustomApiResponse<Double>> getAverageAttemptsForSuccess() {
        return analyticsService.getAverageAttemptsForSuccess();
    }
}
