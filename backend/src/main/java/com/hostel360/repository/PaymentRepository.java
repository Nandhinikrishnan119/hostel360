package com.hostel360.repository;

import com.hostel360.entity.Payment;
import com.hostel360.entity.enums.PaymentStatus;
import com.hostel360.entity.enums.PaymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentId(Long studentId);

    List<Payment> findByHostelId(Long hostelId);

    Optional<Payment> findByInvoiceNumber(String invoiceNumber);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE " +
           "(:hostelId IS NULL OR p.hostel.id = :hostelId) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:paymentType IS NULL OR p.paymentType = :paymentType) AND " +
           "(:search IS NULL OR LOWER(p.student.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.student.studentId) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.invoiceNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Payment> filterPayments(@Param("hostelId") Long hostelId,
                                 @Param("status") PaymentStatus status,
                                 @Param("paymentType") PaymentType paymentType,
                                 @Param("search") String search,
                                 Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.paidAmount), 0) FROM Payment p WHERE p.status = 'PAID'")
    BigDecimal getTotalCollectedAmount();

    @Query("SELECT COALESCE(SUM(p.amount - COALESCE(p.paidAmount, 0)), 0) FROM Payment p WHERE p.status IN ('PENDING', 'OVERDUE', 'PARTIALLY_PAID')")
    BigDecimal getTotalPendingAmount();

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'OVERDUE' OR (p.status = 'PENDING' AND p.dueDate < :today)")
    Long countOverduePayments(@Param("today") LocalDate today);
}
