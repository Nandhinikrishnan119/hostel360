package com.hostel360.controller;

import com.hostel360.dto.response.ApiResponse;
import com.hostel360.service.EscalationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/escalations")
@RequiredArgsConstructor
@Tag(name = "Automated Complaint Escalation Engine", description = "Endpoints for triggering SLA sweeps and manual warden escalations")
public class EscalationController {

    private final EscalationService escalationService;

    @PostMapping("/trigger-sla")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Manually trigger background SLA overdue sweep")
    public ResponseEntity<ApiResponse> triggerSlaCheck() {
        escalationService.processOverdueComplaints();
        return ResponseEntity.ok(ApiResponse.ok("SLA overdue check triggered successfully"));
    }

    @PostMapping("/{complaintId}/manual")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Warden manual escalation to next tier")
    public ResponseEntity<ApiResponse> manualEscalate(
            @PathVariable Long complaintId, @RequestBody(required = false) Map<String, String> payload) {
        String reason = payload != null ? payload.get("reason") : "Manual escalation";
        escalationService.manualEscalate(complaintId, reason);
        return ResponseEntity.ok(ApiResponse.ok("Complaint escalated to next tier successfully"));
    }
}
