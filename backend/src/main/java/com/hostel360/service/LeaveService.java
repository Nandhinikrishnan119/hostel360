package com.hostel360.service;

import com.hostel360.dto.request.LateEntrySubmitRequest;
import com.hostel360.dto.request.LeaveSubmitRequest;
import com.hostel360.entity.LateEntry;
import com.hostel360.entity.LeaveRequest;
import com.hostel360.entity.Student;
import com.hostel360.entity.User;
import com.hostel360.entity.enums.LateEntryStatus;
import com.hostel360.entity.enums.LeaveStatus;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.LateEntryRepository;
import com.hostel360.repository.LeaveRequestRepository;
import com.hostel360.repository.StudentRepository;
import com.hostel360.repository.UserRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LateEntryRepository lateEntryRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public LeaveRequest submitLeaveRequest(LeaveSubmitRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be prior to start date");
        }

        LeaveRequest leave = LeaveRequest.builder()
                .student(student)
                .leaveType(request.getLeaveType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .reason(request.getReason())
                .destinationAddress(request.getDestinationAddress())
                .travelMode(request.getTravelMode())
                .parentConsentVerified(request.getParentConsentVerified() != null ? request.getParentConsentVerified() : false)
                .status(LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leave);

        // Notify Warden
        if (student.getHostel() != null && student.getHostel().getWarden() != null) {
            notificationService.sendNotification(
                    student.getHostel().getWarden().getId(),
                    "New Leave Request: " + student.getUser().getFullName(),
                    student.getStudentId() + " applied for leave from " + request.getStartDate() + " to " + request.getEndDate(),
                    NotificationType.LEAVE,
                    saved.getId(),
                    "/warden/leaves"
            );
        }

        auditLogService.logAction(student.getUser(), "SUBMIT_LEAVE", "LeaveRequest", saved.getId(), null, request.getLeaveType().name(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getMyLeaves() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return leaveRequestRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getPendingLeaves(Long hostelId) {
        if (hostelId != null) {
            return leaveRequestRepository.findByStudentHostelIdAndStatus(hostelId, LeaveStatus.PENDING);
        }
        return leaveRequestRepository.findByStatus(LeaveStatus.PENDING);
    }

    @Transactional
    public LeaveRequest approveLeave(Long id, String remarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        Long userId = SecurityUtils.getCurrentUserId();
        User warden = userRepository.findById(userId).orElse(null);

        leave.setStatus(LeaveStatus.APPROVED_WARDEN);
        leave.setApprovedBy(warden);
        leave.setWardenRemarks(remarks);

        LeaveRequest saved = leaveRequestRepository.save(leave);

        notificationService.sendNotification(
                leave.getStudent().getUser().getId(),
                "Leave Approved ✅",
                "Your leave request (" + leave.getStartDate() + " to " + leave.getEndDate() + ") was approved by Warden.",
                NotificationType.LEAVE,
                saved.getId(),
                "/student/leave"
        );

        auditLogService.logAction(warden, "APPROVE_LEAVE", "LeaveRequest", saved.getId(), "PENDING", "APPROVED_WARDEN", "127.0.0.1");

        return saved;
    }

    @Transactional
    public LeaveRequest rejectLeave(Long id, String remarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        Long userId = SecurityUtils.getCurrentUserId();
        User warden = userRepository.findById(userId).orElse(null);

        leave.setStatus(LeaveStatus.REJECTED);
        leave.setApprovedBy(warden);
        leave.setWardenRemarks(remarks);

        LeaveRequest saved = leaveRequestRepository.save(leave);

        notificationService.sendNotification(
                leave.getStudent().getUser().getId(),
                "Leave Request Rejected ❌",
                "Reason: " + (remarks != null ? remarks : "Rejected by Warden"),
                NotificationType.LEAVE,
                saved.getId(),
                "/student/leave"
        );

        auditLogService.logAction(warden, "REJECT_LEAVE", "LeaveRequest", saved.getId(), "PENDING", "REJECTED", "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<LeaveRequest> getActiveApprovedLeavesForSecurity() {
        return leaveRequestRepository.findActiveApprovedLeavesForSecurity(LocalDate.now());
    }

    @Transactional
    public LeaveRequest recordGateCheckout(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        leave.setStatus(LeaveStatus.CHECKED_OUT);
        leave.setActualCheckoutTime(LocalDateTime.now());
        return leaveRequestRepository.save(leave);
    }

    @Transactional
    public LeaveRequest recordGateCheckin(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", id));

        leave.setStatus(LeaveStatus.CHECKED_IN);
        leave.setActualCheckinTime(LocalDateTime.now());
        return leaveRequestRepository.save(leave);
    }

    // Late Entry Module
    @Transactional
    public LateEntry submitLateEntry(LateEntrySubmitRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        LateEntry entry = LateEntry.builder()
                .student(student)
                .date(request.getDate())
                .expectedTime(request.getExpectedTime())
                .reason(request.getReason())
                .status(LateEntryStatus.DECLARED)
                .build();

        LateEntry saved = lateEntryRepository.save(entry);
        auditLogService.logAction(student.getUser(), "SUBMIT_LATE_ENTRY", "LateEntry", saved.getId(), null, request.getExpectedTime().toString(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<LateEntry> getLateEntriesToday(Long hostelId) {
        LocalDate today = LocalDate.now();
        if (hostelId != null) {
            return lateEntryRepository.findByStudentHostelIdAndDate(hostelId, today);
        }
        return lateEntryRepository.findByDateOrderByExpectedTimeAsc(today);
    }

    @Transactional(readOnly = true)
    public List<LateEntry> getMyLateEntries() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return lateEntryRepository.findByStudentIdOrderByDateDesc(student.getId());
    }

    @Transactional
    public LateEntry recordLateEntryArrival(Long id, String remarks) {
        LateEntry entry = lateEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LateEntry", "id", id));

        Long securityUserId = SecurityUtils.getCurrentUserId();
        User securityStaff = userRepository.findById(securityUserId).orElse(null);

        LocalDateTime now = LocalDateTime.now();
        entry.setActualEntryTime(now);
        entry.setRecordedBySecurity(securityStaff);
        entry.setRemarks(remarks);

        if (now.toLocalTime().isAfter(entry.getExpectedTime().plusMinutes(15))) {
            entry.setStatus(LateEntryStatus.ARRIVED_LATE);
        } else {
            entry.setStatus(LateEntryStatus.ARRIVED_ON_TIME);
        }

        return lateEntryRepository.save(entry);
    }
}
