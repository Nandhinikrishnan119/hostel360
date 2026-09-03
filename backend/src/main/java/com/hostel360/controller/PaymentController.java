package com.hostel360.controller;

import com.hostel360.dto.request.PaymentCreateRequest;
import com.hostel360.dto.request.RecordPaymentRequest;
import com.hostel360.dto.response.PaymentResponse;
import com.hostel360.dto.response.PaymentSummaryResponse;
import com.hostel360.entity.enums.PaymentStatus;
import com.hostel360.entity.enums.PaymentType;
import com.hostel360.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/payments", "/api/payment"})
@RequiredArgsConstructor
@Tag(name = "Hostel Payments & Fees", description = "Endpoints for hostel fee invoices, payment processing, and revenue summaries")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Generate new fee invoice for a resident")
    public ResponseEntity<PaymentResponse> createInvoice(@Valid @RequestBody PaymentCreateRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentInvoice(request));
    }

    @PutMapping("/{id}/record")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Record payment transaction against an invoice")
    public ResponseEntity<PaymentResponse> recordPayment(
            @PathVariable Long id,
            @Valid @RequestBody RecordPaymentRequest request) {
        return ResponseEntity.ok(paymentService.recordPayment(id, request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Filter all payments with pagination, search, status, and category")
    public ResponseEntity<Page<PaymentResponse>> getPayments(
            @RequestParam(required = false) Long hostelId,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentType paymentType,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(paymentService.filterPayments(hostelId, status, paymentType, search, pageable));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get all invoices and receipts of current logged-in resident")
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        return ResponseEntity.ok(paymentService.getMyPayments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'STUDENT')")
    @Operation(summary = "Get single invoice details by ID")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get overall payment collection and pending dues summary")
    public ResponseEntity<PaymentSummaryResponse> getPaymentSummary() {
        return ResponseEntity.ok(paymentService.getPaymentSummary());
    }
}
