package com.example.paymentretry.repository;

import com.example.paymentretry.model.ErrorLog;
import com.example.paymentretry.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {
    List<ErrorLog> findByTransaction(Transaction transaction);
    Page<ErrorLog> findByErrorCode(String errorCode, Pageable pageable);

    @Query("SELECT e FROM ErrorLog e WHERE e.createdAt >= :startDate AND e.createdAt <= :endDate")
    Page<ErrorLog> findByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT e FROM ErrorLog e WHERE e.errorCode = :errorCode AND e.createdAt >= :startDate AND e.createdAt <= :endDate")
    Page<ErrorLog> findByErrorCodeAndDateRange(String errorCode, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT e.errorCode, COUNT(e) FROM ErrorLog e GROUP BY e.errorCode ORDER BY COUNT(e) DESC")
    List<Object[]> findMostCommonErrorCodes(Pageable pageable);
}
