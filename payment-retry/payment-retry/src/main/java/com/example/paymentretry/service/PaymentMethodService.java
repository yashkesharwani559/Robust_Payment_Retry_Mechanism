package com.example.paymentretry.service;

import com.example.paymentretry.exception.ResourceNotFoundException;
import com.example.paymentretry.exception.UnauthorisedAccess;
import com.example.paymentretry.model.PaymentMethod;
import com.example.paymentretry.model.User;
import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.PaymentMethodRequest;
import com.example.paymentretry.payload.PaymentMethodResponse;
import com.example.paymentretry.repository.PaymentMethodRepository;
import com.example.paymentretry.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {
    private final Logger logger = LoggerFactory.getLogger(PaymentMethodService.class);

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private UserRepository userRepository;

    // Add a new payment method
    @Transactional
    public CustomApiResponse<PaymentMethodResponse> addPaymentMethod(Long userId, PaymentMethodRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (req.getDefault()) {
            paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(pm -> {
                        pm.setDefault(false);
                        paymentMethodRepository.save(pm);
                    });
        }

        PaymentMethod pm = new PaymentMethod.Builder()
                .user(user)
                .methodName(req.getMethodName())
                .details(req.getDetails())
                .priority(req.getPriority())
                .isDefault(req.getDefault())
                .build();

        pm = paymentMethodRepository.save(pm);

        return CustomApiResponse.success(
                map(pm),
                "Payment method added successfully",
                true
        );
    }

    public CustomApiResponse<List<PaymentMethodResponse>> getUserPaymentMethods(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User", "id", userId);
        }
        List<PaymentMethodResponse> dtos = paymentMethodRepository
                .findByUserIdOrderByPriorityAsc(userId)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());

        return CustomApiResponse.success(dtos, "Fetched payment methods successfully", true);
    }

    public CustomApiResponse<PaymentMethodResponse> getPaymentMethodById(Long userId, Long pmId) {
        PaymentMethod pm = paymentMethodRepository.findById(pmId)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod", "id", pmId));

        if (!pm.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("You don't have permission to view this payment method");
        }
        return CustomApiResponse.success(map(pm), "Fetched payment method successfully", true);
    }

    @Transactional
    public CustomApiResponse<PaymentMethodResponse> updatePaymentMethod(
            Long userId, Long pmId, PaymentMethodRequest req) {

        PaymentMethod pm = paymentMethodRepository.findById(pmId)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod", "id", pmId));

        if (!pm.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("You don't have permission to update this payment method");
        }

        if (req.getDefault() && !pm.getDefault()) {
            paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existing -> {
                        existing.setDefault(false);
                        paymentMethodRepository.save(existing);
                    });
        }

        pm.setMethodName(req.getMethodName());
        pm.setDetails(req.getDetails());
        pm.setPriority(req.getPriority());
        pm.setDefault(req.getDefault());

        pm = paymentMethodRepository.save(pm);

        return CustomApiResponse.success(map(pm), "Payment method updated successfully", true);
    }

    @Transactional
    public CustomApiResponse<Void> deletePaymentMethod(Long userId, Long pmId) {
        PaymentMethod pm = paymentMethodRepository.findById(pmId)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentMethod", "id", pmId));

        if (!pm.getUser().getId().equals(userId)) {
            throw new UnauthorisedAccess("You don't have permission to delete this payment method");
        }

        paymentMethodRepository.delete(pm);
        return CustomApiResponse.success(null, "Payment method deleted successfully", true);
    }

    private PaymentMethodResponse map(PaymentMethod pm) {
        return PaymentMethodResponse.builder()
                .id(pm.getId())
                .methodName(pm.getMethodName())
                .details(pm.getDetails())
                .priority(pm.getPriority())
                .isDefault(pm.getDefault())
                .build();
    }
}
