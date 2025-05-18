package com.example.paymentretry.repository;

import com.example.paymentretry.model.PaymentMethod;
import com.example.paymentretry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
    // Find all payment methods for a specific user
    List<PaymentMethod> findByUserId(Long userId);

    // Find the default payment method for a user
//    PaymentMethod findByUserIdAndIsDefaultTrue(Long userId);

    List<PaymentMethod> findByUserIdOrderByPriorityAsc(Long userId);

    // Find the default payment method for a user by userId
    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(Long userId);
}
