package com.hostel360.controller;

import com.hostel360.dto.request.AddCommentRequest;
import com.hostel360.dto.request.AssignComplaintRequest;
import com.hostel360.dto.request.CreateComplaintRequest;
import com.hostel360.dto.request.UpdateComplaintStatusRequest;
import com.hostel360.dto.response.ApiResponse;
import com.hostel360.dto.response.ComplaintDetailResponse;
import com.hostel360.dto.response.DuplicateIssueResponse;
import com.hostel360.entity.ComplaintCategory;
import com.hostel360.entity.enums.ComplaintStatus;
import com.hostel360.entity.enums.PriorityLevel;
import com.hostel360.repository.ComplaintCategoryRepository;
import com.hostel360.service.ComplaintService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@Tag(name = "Hostel Complaint & Maintenance Module", description = "Endpoints for ticket reporting, SLA tracking, duplicate detection, and work orders")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintCategoryRepository complaintCategoryRepository;

    @GetMapping("/categories")
    @Operation(summary = "Get list of available complaint categories and SLA definitions")
    public ResponseEntity<List<ComplaintCategory>> getCategories() {
        return ResponseEntity.ok(complaintCategoryRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a new hostel complaint (automatic SLA calculation & duplicate check)")
    public ResponseEntity<ComplaintDetailResponse> createComplaint(@Valid @RequestBody CreateComplaintRequest request) {
        return ResponseEntity.ok(complaintService.createComplaint(request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get active and historical complaints submitted by current student")
    public ResponseEntity<List<ComplaintDetailResponse>> getMyComplaints() {
        return ResponseEntity.ok(complaintService.getMyComplaints());
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasAnyRole('MAINTENANCE_STAFF', 'WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Get complaints assigned to current maintenance technician")
    public ResponseEntity<List<ComplaintDetailResponse>> getAssignedComplaints() {
        return ResponseEntity.ok(complaintService.getAssignedComplaints());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full ticket details, timeline, comments, and attachments")
    public ResponseEntity<ComplaintDetailResponse> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Delete a submitted complaint owned by the current student")
    public ResponseEntity<ApiResponse> deleteComplaint(@PathVariable Long id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok(ApiResponse.ok("Complaint deleted successfully"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'MAINTENANCE_STAFF')")
    @Operation(summary = "Filter complaints with pagination, category, priority, status, and block")
    public ResponseEntity<Page<ComplaintDetailResponse>> filterComplaints(
            @RequestParam(required = false) Long hostelId,
            @RequestParam(required = false) Long blockId,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) PriorityLevel priority,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(complaintService.filterComplaints(hostelId, blockId, status, priority, categoryId, search, pageable));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Assign complaint to maintenance technician")
    public ResponseEntity<ComplaintDetailResponse> assignComplaint(
            @PathVariable Long id, @Valid @RequestBody AssignComplaintRequest request) {
        return ResponseEntity.ok(complaintService.assignComplaint(id, request));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MAINTENANCE_STAFF', 'WARDEN', 'SUPER_ADMIN')")
    @Operation(summary = "Update complaint status (IN_PROGRESS, RESOLVED with notes/proof)")
    public ResponseEntity<ComplaintDetailResponse> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateComplaintStatusRequest request) {
        return ResponseEntity.ok(complaintService.updateStatus(id, request));
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student confirms resolution of complaint")
    public ResponseEntity<ComplaintDetailResponse> confirmResolution(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.confirmResolution(id));
    }

    @PostMapping("/{id}/reopen")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student reopens an unsatisfactory resolved complaint")
    public ResponseEntity<ComplaintDetailResponse> reopenComplaint(
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "Issue persists");
        return ResponseEntity.ok(complaintService.reopenComplaint(id, reason));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Add discussion comment on a complaint ticket")
    public ResponseEntity<ApiResponse> addComment(
            @PathVariable Long id, @Valid @RequestBody AddCommentRequest request) {
        complaintService.addComment(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Comment posted successfully"));
    }

    @GetMapping("/duplicates")
    @Operation(summary = "Check for duplicate issues in the same block/hostel")
    public ResponseEntity<DuplicateIssueResponse> checkDuplicates(
            @RequestParam Long categoryId,
            @RequestParam Long hostelId,
            @RequestParam Long blockId) {
        return ResponseEntity.ok(complaintService.detectDuplicates(categoryId, hostelId, blockId));
    }
}
