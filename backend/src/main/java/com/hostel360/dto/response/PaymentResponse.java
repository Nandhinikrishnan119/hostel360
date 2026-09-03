package com.hostel360.dto.response;

import com.hostel360.entity.enums.PaymentMethod;
import com.hostel360.entity.enums.PaymentStatus;
import com.hostel360.entity.enums.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private String invoiceNumber;
    private Long studentId;
    private String studentName;
    private String studentRollNo;
    private String studentPhone;
    private String roomNumber;
    private String blockName;
    private Long hostelId;
    private String hostelName;
    private PaymentType paymentType;
    private BigDecimal amount;
    private BigDecimal paidAmount;
    private BigDecimal remainingBalance;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private String transactionReference;
    private LocalDate dueDate;
    private LocalDateTime paymentDate;
    private String academicYear;
    private String semester;
    private String remarks;
    private String receiptUrl;
    private LocalDateTime createdAt;
}
