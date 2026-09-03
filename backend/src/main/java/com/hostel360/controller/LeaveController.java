package com.hostel360.controller;

import com.hostel360.dto.request.LateEntrySubmitRequest;
import com.hostel360.dto.request.LeaveSubmitRequest;
import com.hostel360.dto.response.ApiResponse;
import com.hostel360.entity.LateEntry;
import com.hostel360.entity.LeaveRequest;
import com.hostel360.service.LeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave")
@RequiredArgsConstructor
@Tag(name = "Leave & Late Entry Management", description = "Endpoints for student leave applications, warden approvals, security gate pass verification, and late entry monitoring")
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a student leave / going home application")
    public ResponseEntity<LeaveRequest> submitLeave(@Valid @RequestBody LeaveSubmitRequest request) {
        return ResponseEntity.ok(leaveService.submitLeaveRequest(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get leave history of currently logged-in student")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves() {
        return ResponseEntity.ok(leaveService.getMyLeaves());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Get pending leave applications awaiting warden review")
    public ResponseEntity<List<LeaveRequest>> getPendingLeaves(@RequestParam(required = false) Long hostelId) {
        return ResponseEntity.ok(leaveService.getPendingLeaves(hostelId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Warden approves student leave application")
    public ResponseEntity<LeaveRequest> approveLeave(
            @PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String remarks = payload != null ? payload.get("remarks") : "Approved";
        return ResponseEntity.ok(leaveService.approveLeave(id, remarks));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Warden rejects student leave application")
    public ResponseEntity<LeaveRequest> rejectLeave(
            @PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String remarks = payload != null ? payload.get("remarks") : "Rejected";
        return ResponseEntity.ok(leaveService.rejectLeave(id, remarks));
    }

    @GetMapping("/security/active")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Security gate desk view of currently approved leaves for check-out/check-in verification")
    public ResponseEntity<List<LeaveRequest>> getActiveApprovedLeavesForSecurity() {
        return ResponseEntity.ok(leaveService.getActiveApprovedLeavesForSecurity());
    }

    @PutMapping("/{id}/checkout")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Security marks student checked out at campus gate")
    public ResponseEntity<LeaveRequest> recordGateCheckout(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.recordGateCheckout(id));
    }

    @PutMapping("/{id}/checkin")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Security marks student checked in upon return")
    public ResponseEntity<LeaveRequest> recordGateCheckin(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.recordGateCheckin(id));
    }

    // Late Entry Endpoints
    @PostMapping("/late-entry")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student declares expected late arrival")
    public ResponseEntity<LateEntry> submitLateEntry(@Valid @RequestBody LateEntrySubmitRequest request) {
        return ResponseEntity.ok(leaveService.submitLateEntry(request));
    }

    @GetMapping("/late-entry/today")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Get expected and recorded late entries for today")
    public ResponseEntity<List<LateEntry>> getLateEntriesToday(@RequestParam(required = false) Long hostelId) {
        return ResponseEntity.ok(leaveService.getLateEntriesToday(hostelId));
    }

    @GetMapping("/late-entry/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's declared late entries")
    public ResponseEntity<List<LateEntry>> getMyLateEntries() {
        return ResponseEntity.ok(leaveService.getMyLateEntries());
    }

    @PutMapping("/late-entry/{id}/record-arrival")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Security records actual arrival time and remarks for a late entry")
    public ResponseEntity<LateEntry> recordLateEntryArrival(
            @PathVariable Long id, @RequestBody(required = false) Map<String, String> payload) {
        String remarks = payload != null ? payload.get("remarks") : null;
        return ResponseEntity.ok(leaveService.recordLateEntryArrival(id, remarks));
    }
}
