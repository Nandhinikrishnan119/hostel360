package com.hostel360.controller;

import com.hostel360.dto.response.DashboardSummaryResponse;
import com.hostel360.dto.response.HostelHealthScoreResponse;
import com.hostel360.dto.response.PredictiveMaintenanceResponse;
import com.hostel360.entity.AuditLog;
import com.hostel360.service.AnalyticsService;
import com.hostel360.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Analytics, Health Score & Audit", description = "Endpoints for platform overview KPIs, explainable Hostel Health Score, and predictive maintenance insights")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get high-level dashboard summary metrics across complaints, occupancy, mess, and health")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/hostel-health-score")
    @Operation(summary = "Get explainable Hostel Health Score (0-100) with factor-by-factor breakdown")
    public ResponseEntity<HostelHealthScoreResponse> getHostelHealthScore(@RequestParam(defaultValue = "1") Long hostelId) {
        return ResponseEntity.ok(analyticsService.getHostelHealthScore(hostelId));
    }

    @GetMapping("/predictive-maintenance")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'MAINTENANCE_STAFF')")
    @Operation(summary = "Get predictive maintenance insights: recurring room issues & block failure trends")
    public ResponseEntity<PredictiveMaintenanceResponse> getPredictiveInsights() {
        return ResponseEntity.ok(analyticsService.getPredictiveMaintenanceInsights());
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Get paginated security audit logs (Super Admin only)")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(auditLogService.getAuditLogs(pageable));
    }
}
