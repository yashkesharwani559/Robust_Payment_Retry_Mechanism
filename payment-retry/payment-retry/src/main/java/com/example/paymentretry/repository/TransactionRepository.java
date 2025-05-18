package com.example.paymentretry.repository;

import com.example.paymentretry.model.Transaction;
import com.example.paymentretry.model.TransactionStatus;
import com.example.paymentretry.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUser(User user, Pageable pageable);
    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);
    Page<Transaction> findByUserAndStatus(User user, TransactionStatus status, Pageable pageable);

    // Optimized query for recent transactions
    List<Transaction> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    // Optimized native query for pending retries
    @Query(value = """
        SELECT t.* FROM transactions t
        JOIN retry_configurations rc ON t.id = rc.transaction_id
        WHERE t.status IN ('FAILED', 'RETRY_SCHEDULED')
        AND rc.current_attempts < rc.max_retries
        AND rc.next_retry_time <= :now
        ORDER BY rc.next_retry_time
        """, nativeQuery = true)
    List<Transaction> findPendingRetriesNative(@Param("now") LocalDateTime now);

    @Query("SELECT t FROM Transaction t WHERE t.status = :status AND t.createdAt >= :startDate AND t.createdAt <= :endDate")
    List<Transaction> findByStatusAndDateRange(TransactionStatus status, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status")
    Long countByStatus(TransactionStatus status);

    Optional<Transaction> findByExternalReferenceId(String externalReferenceId);

    // New query for analytics
    @Query(value = """
        SELECT DATE(t.created_at) as date, 
               COUNT(CASE WHEN t.status = 'SUCCESS' THEN 1 END) as successful,
               COUNT(CASE WHEN t.status = 'FAILED' THEN 1 END) as failed,
               COUNT(*) as total
        FROM transactions t
        WHERE t.created_at >= :startDate
        GROUP BY DATE(t.created_at)
        ORDER BY date DESC
        """, nativeQuery = true)
    List<Object[]> getTransactionTrend(@Param("startDate") LocalDateTime startDate);

    // Query for retry success rate
    @Query(value = """
        SELECT COUNT(CASE WHEN t.status = 'SUCCESS' THEN 1 END) * 100.0 / COUNT(*)
        FROM transactions t
        JOIN retry_configurations rc ON t.id = rc.transaction_id
        WHERE rc.current_attempts > 0
        """, nativeQuery = true)
    Double getRetrySuccessRate();

    List<Transaction> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable p);

}
