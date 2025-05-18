package com.example.paymentretry.repository;

import com.example.paymentretry.model.RetryConfiguration;
import com.example.paymentretry.model.Transaction;
import com.example.paymentretry.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RetryConfigurationRepository extends JpaRepository<RetryConfiguration, Long> {
    Optional<RetryConfiguration> findByTransaction(Transaction transaction);

    @Query("SELECT rc FROM RetryConfiguration rc WHERE rc.nextRetryTime <= :now AND rc.currentAttempts < rc.maxRetries")
    List<RetryConfiguration> findPendingRetries(@Param("now") LocalDateTime now);

    // Optimized query for pending retries with transaction status
    @Query("""
  SELECT rc
    FROM RetryConfiguration rc
    JOIN rc.transaction t
   WHERE rc.nextRetryTime <= :now
     AND rc.currentAttempts < rc.maxRetries
     AND t.status IN :eligibleStatuses
   ORDER BY rc.nextRetryTime
""")
    List<RetryConfiguration> findEligiblePendingRetries(
            @Param("now") LocalDateTime now,
            @Param("eligibleStatuses") List<com.example.paymentretry.model.TransactionStatus> eligibleStatuses
    );

    Optional<RetryConfiguration> findByTransactionId(Long transactionId);

    // Statistics query
    @Query("SELECT AVG(rc.currentAttempts) " +
            "FROM RetryConfiguration rc " +
            "WHERE rc.transaction.status = :status")
    Double getAverageAttemptsByStatus(@Param("status") TransactionStatus status);

    /**
            * Compute the average number of retry attempts for transactions that succeeded.
     */
    @Query("""
        SELECT AVG(rc.currentAttempts)
          FROM RetryConfiguration rc
         WHERE rc.transaction.status = com.example.paymentretry.model.TransactionStatus.SUCCESS
        """ )
    Double getAverageAttemptsForSuccessfulTransactions();

    /**
     * Retrieve retry configurations pending retry as of the given timestamp.
     */
    @Query("""
        SELECT rc
          FROM RetryConfiguration rc
          JOIN rc.transaction t
         WHERE rc.nextRetryTime <= :now
           AND rc.currentAttempts < rc.maxRetries
           AND (t.status = com.example.paymentretry.model.TransactionStatus.RETRY_SCHEDULED
                OR t.status = com.example.paymentretry.model.TransactionStatus.FAILED)
         ORDER BY rc.nextRetryTime
        """ )
    List<RetryConfiguration> findEligiblePendingRetries(@Param("now") LocalDateTime now);

}
