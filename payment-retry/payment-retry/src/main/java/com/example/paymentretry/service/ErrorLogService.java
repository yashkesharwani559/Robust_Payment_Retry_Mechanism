package com.example.paymentretry.service;

import com.example.paymentretry.model.ErrorLog;
import com.example.paymentretry.payload.ErrorLogResponse;
import com.example.paymentretry.payload.PagedResponse;
import com.example.paymentretry.repository.ErrorLogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ErrorLogService {
    private static final Logger logger = LoggerFactory.getLogger(ErrorLogService.class);
    @Autowired
    private final ErrorLogRepository errorLogRepository;

    public ErrorLogService(ErrorLogRepository errorLogRepository) {
        this.errorLogRepository = errorLogRepository;
    }

    /**
     * Fetch paginated error logs, optional filters.
     */
    @Transactional
    public PagedResponse<ErrorLogResponse> getErrorLogs(
            String errorCode,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) {

        Pageable pg = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ErrorLog> p;

        if (errorCode != null && !errorCode.isBlank() && startDate != null && endDate != null) {
            if (endDate.isBefore(startDate)) {
                throw new IllegalArgumentException("endDate must be on or after startDate");
            }
            LocalDateTime start = startDate.atStartOfDay();
            LocalDateTime end   = endDate.atTime(LocalTime.MAX);
            p = errorLogRepository.findByErrorCodeAndDateRange(errorCode, start, end, pg);

        } else if (errorCode != null && !errorCode.isBlank()) {
            p = errorLogRepository.findByErrorCode(errorCode, pg);

        } else if (startDate != null && endDate != null) {
            if (endDate.isBefore(startDate)) {
                throw new IllegalArgumentException("endDate must be on or after startDate");
            }
            LocalDateTime start = startDate.atStartOfDay();
            LocalDateTime end   = endDate.atTime(LocalTime.MAX);
            p = errorLogRepository.findByDateRange(start, end, pg);

        } else {
            p = errorLogRepository.findAll(pg);
        }

        List<ErrorLogResponse> content = p.getContent().stream()
                .map(this::mapToErrorLogResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content, p.getNumber(), p.getSize(),
                p.getTotalElements(), p.getTotalPages(), p.isLast()
        );
    }

    /**
     * Fetch top N common error codes and their counts.
     */
    @Transactional
    public List<Map<String,Object>> getMostCommonErrorCodes(int limit) {
        if (limit < 1) {
            throw new IllegalArgumentException("limit must be >= 1");
        }
        Pageable pg = PageRequest.of(0, limit);
        List<Object[]> rows = errorLogRepository.findMostCommonErrorCodes(pg);

        return rows.stream().map(r -> {
            Map<String,Object> m = new HashMap<>();
            m.put("errorCode", r[0]);
            m.put("count", r[1]);
            return m;
        }).collect(Collectors.toList());
    }

    private ErrorLogResponse mapToErrorLogResponse(ErrorLog log) {
        return ErrorLogResponse.builder()
                .id(log.getId())
                .transactionId(log.getTransaction().getId())
                .errorCode(log.getErrorCode())
                .errorMessage(log.getErrorMessage())
                .retryEligible(log.getRetryEligible())
                .retryAttempt(log.getRetryAttempt())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
