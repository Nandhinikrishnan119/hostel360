package com.hostel360.controller;

import com.hostel360.dto.request.HealthFollowUpRequest;
import com.hostel360.dto.request.HealthRecordRequest;
import com.hostel360.entity.HealthFollowUp;
import com.hostel360.entity.HealthRecord;
import com.hostel360.service.HealthWelfareService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Tag(name = "Student Health & Welfare Module (Confidential)", description = "Secure endpoints for student medical reporting and warden follow-up logs")
public class HealthWelfareController {

    private final HealthWelfareService healthWelfareService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student reports unwell / medical condition voluntarily")
    public ResponseEntity<HealthRecord> reportHealth(@Valid @RequestBody HealthRecordRequest request) {
        return ResponseEntity.ok(healthWelfareService.reportHealthStatus(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's medical reporting history")
    public ResponseEntity<List<HealthRecord>> getMyHealthRecords() {
        return ResponseEntity.ok(healthWelfareService.getMyHealthRecords());
    }

    @GetMapping("/warden/active")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Warden view of currently unwell students and hospital visits")
    public ResponseEntity<List<HealthRecord>> getActiveWelfareCases(@RequestParam(required = false) Long hostelId) {
        return ResponseEntity.ok(healthWelfareService.getActiveWelfareCases(hostelId));
    }

    @PostMapping("/{id}/follow-up")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Warden logs student wellness check follow-up")
    public ResponseEntity<HealthFollowUp> recordFollowUp(
            @PathVariable Long id, @Valid @RequestBody HealthFollowUpRequest request) {
        return ResponseEntity.ok(healthWelfareService.recordFollowUp(id, request));
    }

    @GetMapping("/{id}/follow-ups")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN', 'STUDENT')")
    @Operation(summary = "Get follow-up history for a health record")
    public ResponseEntity<List<HealthFollowUp>> getFollowUpsForRecord(@PathVariable Long id) {
        return ResponseEntity.ok(healthWelfareService.getFollowUpsForRecord(id));
    }
}
