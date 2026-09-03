package com.hostel360.controller;

import com.hostel360.dto.request.AnnouncementRequest;
import com.hostel360.dto.request.EmergencyReportRequest;
import com.hostel360.dto.request.ParcelRegisterRequest;
import com.hostel360.dto.response.ApiResponse;
import com.hostel360.entity.Announcement;
import com.hostel360.entity.EmergencyReport;
import com.hostel360.entity.Notification;
import com.hostel360.entity.Parcel;
import com.hostel360.service.NotificationService;
import com.hostel360.service.OperationsService;
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
@RequestMapping("/api/operations")
@RequiredArgsConstructor
@Tag(name = "Hostel Operations & Safety", description = "Endpoints for Announcements, Parcel Desk with OTP, Emergency Broadcasts, and Notifications")
public class OperationController {

    private final OperationsService operationsService;
    private final NotificationService notificationService;

    // Announcements
    @PostMapping("/announcements")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Publish a global or hostel-wide announcement")
    public ResponseEntity<Announcement> publishAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        return ResponseEntity.ok(operationsService.publishAnnouncement(request));
    }

    @GetMapping("/announcements")
    @Operation(summary = "Get active announcements for a hostel or global")
    public ResponseEntity<List<Announcement>> getAnnouncements(@RequestParam(required = false) Long hostelId) {
        return ResponseEntity.ok(operationsService.getActiveAnnouncements(hostelId));
    }

    // Parcels
    @PostMapping("/parcels")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Security registers incoming parcel for student (auto-generates collection OTP)")
    public ResponseEntity<Parcel> registerParcel(@Valid @RequestBody ParcelRegisterRequest request) {
        return ResponseEntity.ok(operationsService.registerParcel(request));
    }

    @GetMapping("/parcels/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get parcels arrived for logged in student")
    public ResponseEntity<List<Parcel>> getMyParcels() {
        return ResponseEntity.ok(operationsService.getMyParcels());
    }

    @GetMapping("/parcels/active")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Get uncollected parcels at security desk")
    public ResponseEntity<List<Parcel>> getActiveParcels() {
        return ResponseEntity.ok(operationsService.getActiveParcels());
    }

    @PostMapping("/parcels/{id}/collect")
    @PreAuthorize("hasAnyRole('SECURITY_STAFF', 'SUPER_ADMIN')")
    @Operation(summary = "Verify OTP and mark parcel collected")
    public ResponseEntity<Parcel> collectParcel(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String otp = payload.get("otp");
        return ResponseEntity.ok(operationsService.collectParcel(id, otp));
    }

    // Emergency Reports
    @PostMapping("/emergency")
    @Operation(summary = "Trigger high-priority emergency broadcast (Medical, Fire, Electrical, Security)")
    public ResponseEntity<EmergencyReport> triggerEmergency(@Valid @RequestBody EmergencyReportRequest request) {
        return ResponseEntity.ok(operationsService.triggerEmergency(request));
    }

    @GetMapping("/emergency")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'SECURITY_STAFF')")
    @Operation(summary = "Get all active and past emergency reports")
    public ResponseEntity<List<EmergencyReport>> getEmergencyReports() {
        return ResponseEntity.ok(operationsService.getEmergencyReports());
    }

    @PutMapping("/emergency/{id}/resolve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'SECURITY_STAFF')")
    @Operation(summary = "Resolve emergency report with action taken notes")
    public ResponseEntity<EmergencyReport> resolveEmergency(
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        String actionTaken = payload.getOrDefault("actionTaken", "Resolved by security team");
        return ResponseEntity.ok(operationsService.resolveEmergency(id, actionTaken));
    }

    // Notifications
    @GetMapping("/notifications")
    @Operation(summary = "Get current user's in-app notifications")
    public ResponseEntity<List<Notification>> getMyNotifications() {
        return ResponseEntity.ok(notificationService.getMyNotifications());
    }

    @GetMapping("/notifications/unread-count")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("unreadCount", notificationService.getUnreadCount()));
    }

    @PutMapping("/notifications/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse> markNotificationAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Marked as read"));
    }

    @PutMapping("/notifications/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.ok("All marked as read"));
    }
}
