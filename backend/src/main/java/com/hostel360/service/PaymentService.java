package com.hostel360.service;

import com.hostel360.dto.request.PaymentCreateRequest;
import com.hostel360.dto.request.RecordPaymentRequest;
import com.hostel360.dto.response.PaymentResponse;
import com.hostel360.dto.response.PaymentSummaryResponse;
import com.hostel360.entity.Hostel;
import com.hostel360.entity.Payment;
import com.hostel360.entity.Student;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.entity.enums.PaymentStatus;
import com.hostel360.entity.enums.PaymentType;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.HostelRepository;
import com.hostel360.repository.PaymentRepository;
import com.hostel360.repository.StudentRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final HostelRepository hostelRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public PaymentResponse createPaymentInvoice(PaymentCreateRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Hostel hostel = hostelRepository.findById(request.getHostelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hostel", "id", request.getHostelId()));

        String invoiceNumber = "INV-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .invoiceNumber(invoiceNumber)
                .student(student)
                .hostel(hostel)
                .paymentType(request.getPaymentType())
                .amount(request.getAmount())
                .paidAmount(BigDecimal.ZERO)
                .status(PaymentStatus.PENDING)
                .dueDate(request.getDueDate())
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "2025-2026")
                .semester(request.getSemester() != null ? request.getSemester() : "Spring")
                .remarks(request.getRemarks())
                .receiptUrl("/receipts/" + invoiceNumber + ".pdf")
                .build();

        Payment saved = paymentRepository.save(payment);

        notificationService.sendNotification(
                student.getUser().getId(),
                "New Hostel Fee Invoice Generated",
                "An invoice of ₹" + request.getAmount() + " for " + request.getPaymentType() + " is generated with due date " + request.getDueDate() + ".",
                NotificationType.FEE_PAYMENT,
                saved.getId(),
                "/student/payments"
        );

        auditLogService.logAction("INVOICE_CREATED", "Payment", saved.getId(),
                "Generated fee invoice " + invoiceNumber + " of ₹" + request.getAmount() + " for " + student.getUser().getFullName());

        return mapToResponse(saved);
    }

    @Transactional
    public PaymentResponse recordPayment(Long paymentId, RecordPaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", paymentId));

        if (payment.getStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Invoice is already fully paid.");
        }

        BigDecimal currentPaid = payment.getPaidAmount() != null ? payment.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newTotalPaid = currentPaid.add(request.getPaidAmount());

        payment.setPaidAmount(newTotalPaid);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setTransactionReference(request.getTransactionReference() != null ? request.getTransactionReference() : "TXN-" + System.currentTimeMillis());
        payment.setPaymentDate(LocalDateTime.now());

        if (newTotalPaid.compareTo(payment.getAmount()) >= 0) {
            payment.setStatus(PaymentStatus.PAID);
        } else {
            payment.setStatus(PaymentStatus.PARTIALLY_PAID);
        }

        if (request.getRemarks() != null) {
            payment.setRemarks((payment.getRemarks() != null ? payment.getRemarks() + " | " : "") + request.getRemarks());
        }

        Payment updated = paymentRepository.save(payment);

        notificationService.sendNotification(
                payment.getStudent().getUser().getId(),
                "Payment Received: ₹" + request.getPaidAmount(),
                "Payment of ₹" + request.getPaidAmount() + " received for Invoice #" + payment.getInvoiceNumber() + ". Status: " + payment.getStatus(),
                NotificationType.FEE_PAYMENT,
                updated.getId(),
                "/student/payments"
        );

        auditLogService.logAction("PAYMENT_RECORDED", "Payment", updated.getId(),
                "Recorded payment of ₹" + request.getPaidAmount() + " via " + request.getPaymentMethod() + " for " + payment.getStudent().getUser().getFullName());

        return mapToResponse(updated);
    }

    @Transactional(readOnly = true)
    public Page<PaymentResponse> filterPayments(Long hostelId, PaymentStatus status, PaymentType paymentType, String search, Pageable pageable) {
        return paymentRepository.filterPayments(hostelId, status, paymentType, search, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getMyPayments() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return paymentRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "id", id));
        return mapToResponse(payment);
    }

    @Transactional(readOnly = true)
    public PaymentSummaryResponse getPaymentSummary() {
        BigDecimal collected = paymentRepository.getTotalCollectedAmount();
        BigDecimal pending = paymentRepository.getTotalPendingAmount();
        Long total = paymentRepository.count();
        Long paidCount = (long) paymentRepository.findByStatus(PaymentStatus.PAID).size();
        Long pendingCount = (long) paymentRepository.findByStatus(PaymentStatus.PENDING).size();
        Long overdueCount = paymentRepository.countOverduePayments(LocalDate.now());

        return PaymentSummaryResponse.builder()
                .totalCollectedAmount(collected != null ? collected : BigDecimal.ZERO)
                .totalPendingAmount(pending != null ? pending : BigDecimal.ZERO)
                .totalInvoices(total)
                .paidCount(paidCount)
                .pendingCount(pendingCount)
                .overdueCount(overdueCount)
                .build();
    }

    private PaymentResponse mapToResponse(Payment p) {
        BigDecimal paid = p.getPaidAmount() != null ? p.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal balance = p.getAmount().subtract(paid);
        if (balance.compareTo(BigDecimal.ZERO) < 0) balance = BigDecimal.ZERO;

        return PaymentResponse.builder()
                .id(p.getId())
                .invoiceNumber(p.getInvoiceNumber())
                .studentId(p.getStudent().getId())
                .studentName(p.getStudent().getUser().getFullName())
                .studentRollNo(p.getStudent().getStudentId())
                .studentPhone(p.getStudent().getUser().getPhone())
                .roomNumber(p.getStudent().getRoom() != null ? p.getStudent().getRoom().getRoomNumber() : null)
                .blockName(p.getStudent().getBlock() != null ? p.getStudent().getBlock().getName() : null)
                .hostelId(p.getHostel().getId())
                .hostelName(p.getHostel().getName())
                .paymentType(p.getPaymentType())
                .amount(p.getAmount())
                .paidAmount(paid)
                .remainingBalance(balance)
                .status(p.getStatus())
                .paymentMethod(p.getPaymentMethod())
                .transactionReference(p.getTransactionReference())
                .dueDate(p.getDueDate())
                .paymentDate(p.getPaymentDate())
                .academicYear(p.getAcademicYear())
                .semester(p.getSemester())
                .remarks(p.getRemarks())
                .receiptUrl(p.getReceiptUrl())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
