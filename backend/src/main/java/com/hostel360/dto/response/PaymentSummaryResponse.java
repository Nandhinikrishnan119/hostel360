package com.hostel360.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentSummaryResponse {
    private BigDecimal totalCollectedAmount;
    private BigDecimal totalPendingAmount;
    private Long totalInvoices;
    private Long paidCount;
    private Long pendingCount;
    private Long overdueCount;
}
