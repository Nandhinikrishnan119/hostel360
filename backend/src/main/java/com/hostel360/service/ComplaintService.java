package com.hostel360.service;

import com.hostel360.dto.request.AddCommentRequest;
import com.hostel360.dto.request.AssignComplaintRequest;
import com.hostel360.dto.request.CreateComplaintRequest;
import com.hostel360.dto.request.UpdateComplaintStatusRequest;
import com.hostel360.dto.response.ComplaintDetailResponse;
import com.hostel360.dto.response.DuplicateIssueResponse;
import com.hostel360.entity.*;
import com.hostel360.entity.enums.ComplaintStatus;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.entity.enums.PriorityLevel;
import com.hostel360.entity.enums.RoleType;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.*;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintCategoryRepository complaintCategoryRepository;
    private final ComplaintAttachmentRepository complaintAttachmentRepository;
    private final ComplaintCommentRepository complaintCommentRepository;
    private final EscalationRepository escalationRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final HostelRepository hostelRepository;
    private final BlockRepository blockRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public ComplaintDetailResponse createComplaint(CreateComplaintRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Only registered students can submit complaints"));

        ComplaintCategory category = complaintCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("ComplaintCategory", "id", request.getCategoryId()));

        Hostel hostel = student.getHostel();
        Block block = student.getBlock();
        Room room = student.getRoom();

        if (hostel == null || block == null) {
            throw new BadRequestException("Student is not assigned to a valid Hostel or Block. Please contact Admin.");
        }

        PriorityLevel priority = request.getPriority() != null ? request.getPriority() : category.getDefaultPriority();

        // Calculate SLA deadline
        int slaHours = switch (priority) {
            case CRITICAL -> category.getSlaHoursCritical();
            case HIGH -> category.getSlaHoursHigh();
            case MEDIUM -> category.getSlaHoursMedium();
            case LOW -> category.getSlaHoursLow();
        };
        LocalDateTime slaDeadline = LocalDateTime.now().plusHours(slaHours);

        // Check for duplicate issues in same block within last 48 hours
        LocalDateTime since = LocalDateTime.now().minusHours(48);
        List<Complaint> similarTickets = complaintRepository.findRecentSimilarInBlock(
                hostel.getId(), block.getId(), category.getId(), since, -1L
        );
        boolean isDuplicate = !similarTickets.isEmpty();
        Long duplicateGroupId = isDuplicate ? similarTickets.get(0).getId() : null;

        // Check for recurring issues in this specific room in last 60 days
        boolean isRecurring = false;
        if (room != null) {
            Long countInRoom = complaintRepository.countRecentRoomComplaintsByCategory(
                    room.getId(), category.getId(), LocalDateTime.now().minusDays(60)
            );
            if (countInRoom >= 2) { // 3rd occurrence
                isRecurring = true;
            }
        }

        String complaintNumber = "CMP-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Complaint complaint = Complaint.builder()
                .complaintNumber(complaintNumber)
                .student(student)
                .hostel(hostel)
                .block(block)
                .room(room)
                .category(category)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(priority)
                .status(ComplaintStatus.SUBMITTED)
                .slaDeadline(slaDeadline)
                .escalationLevel(0)
                .isDuplicate(isDuplicate)
                .duplicateGroupId(duplicateGroupId)
                .isRecurring(isRecurring)
                .build();

        Complaint saved = complaintRepository.save(complaint);

        // Notify Warden of new complaint (and critical alerts)
        if (hostel.getWarden() != null) {
            notificationService.sendNotification(
                    hostel.getWarden().getId(),
                    (priority == PriorityLevel.CRITICAL ? "🚨 CRITICAL: " : "New Complaint: ") + complaint.getTitle(),
                    "Complaint #" + complaint.getComplaintNumber() + " submitted in Block " + block.getName() + (room != null ? ", Room " + room.getRoomNumber() : ""),
                    NotificationType.COMPLAINT,
                    saved.getId(),
                    "/warden/complaints"
            );
        }

        auditLogService.logAction(student.getUser(), "CREATE_COMPLAINT", "Complaint", saved.getId(), null, saved.getComplaintNumber(), "127.0.0.1");

        return mapToDetailResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintDetailResponse> getMyComplaints() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return complaintRepository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream()
                .map(this::mapToDetailResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintDetailResponse> getAssignedComplaints() {
        Long userId = SecurityUtils.getCurrentUserId();
        return complaintRepository.findByAssignedToIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDetailResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintDetailResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));
        return mapToDetailResponse(complaint);
    }

        @Transactional
        public void deleteComplaint(Long id) {
                Long userId = SecurityUtils.getCurrentUserId();
                Complaint complaint = complaintRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

                if (!complaint.getStudent().getUser().getId().equals(userId)) {
                        throw new BadRequestException("You can only delete your own complaints");
                }
                if (complaint.getStatus() != ComplaintStatus.SUBMITTED) {
                        throw new BadRequestException("Only submitted complaints can be deleted");
                }

                complaintCommentRepository.deleteByComplaintId(id);
                complaintAttachmentRepository.deleteByComplaintId(id);
                escalationRepository.deleteByComplaintId(id);
                complaintRepository.delete(complaint);
        }

    @Transactional(readOnly = true)
    public Page<ComplaintDetailResponse> filterComplaints(Long hostelId, Long blockId, ComplaintStatus status,
                                                         PriorityLevel priority, Long categoryId,
                                                         String search, Pageable pageable) {
        return complaintRepository.filterComplaints(hostelId, blockId, status, priority, categoryId, search, pageable)
                .map(this::mapToDetailResponse);
    }

    @Transactional
    public ComplaintDetailResponse assignComplaint(Long id, AssignComplaintRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        User staff = userRepository.findById(request.getStaffUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff User", "id", request.getStaffUserId()));

        complaint.setAssignedTo(staff);
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }

        Complaint updated = complaintRepository.save(complaint);

        // Notify assigned staff
        notificationService.sendNotification(
                staff.getId(),
                "Task Assigned: #" + complaint.getComplaintNumber(),
                "You have been assigned: " + complaint.getTitle() + " (Priority: " + complaint.getPriority() + ")",
                NotificationType.COMPLAINT,
                complaint.getId(),
                "/maintenance/work-orders"
        );

        // Notify student
        notificationService.sendNotification(
                complaint.getStudent().getUser().getId(),
                "Complaint Assigned",
                "Your complaint #" + complaint.getComplaintNumber() + " has been assigned to " + staff.getFullName(),
                NotificationType.COMPLAINT,
                complaint.getId(),
                "/student/complaints"
        );

        return mapToDetailResponse(updated);
    }

    @Transactional
    public ComplaintDetailResponse updateStatus(Long id, UpdateComplaintStatusRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        ComplaintStatus oldStatus = complaint.getStatus();
        complaint.setStatus(request.getStatus());

        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
            if (request.getResolutionNotes() != null) {
                complaint.setResolutionNotes(request.getResolutionNotes());
            }
            if (request.getResolutionProofUrl() != null) {
                complaint.setResolutionProofUrl(request.getResolutionProofUrl());
            }

            // Notify student to confirm
            notificationService.sendNotification(
                    complaint.getStudent().getUser().getId(),
                    "Complaint Resolved - Please Confirm",
                    "Complaint #" + complaint.getComplaintNumber() + " marked resolved. Please confirm or reopen.",
                    NotificationType.COMPLAINT,
                    complaint.getId(),
                    "/student/complaints"
            );
        }

        Complaint saved = complaintRepository.save(complaint);
        auditLogService.logAction(complaint.getStudent().getUser(), "UPDATE_STATUS", "Complaint", saved.getId(), oldStatus.name(), saved.getStatus().name(), "127.0.0.1");

        return mapToDetailResponse(saved);
    }

    @Transactional
    public ComplaintDetailResponse confirmResolution(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        complaint.setStatus(ComplaintStatus.STUDENT_CONFIRMED);
        complaint.setStudentConfirmedAt(LocalDateTime.now());
        Complaint saved = complaintRepository.save(complaint);

        return mapToDetailResponse(saved);
    }

    @Transactional
    public ComplaintDetailResponse reopenComplaint(Long id, String reason) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        complaint.setStatus(ComplaintStatus.REOPENED);
        complaint.setReopenedReason(reason);
        // Extend deadline by 24 hours on reopen
        complaint.setSlaDeadline(LocalDateTime.now().plusHours(24));
        Complaint saved = complaintRepository.save(complaint);

        // Notify assigned staff or warden
        if (complaint.getAssignedTo() != null) {
            notificationService.sendNotification(
                    complaint.getAssignedTo().getId(),
                    "Complaint Reopened: #" + complaint.getComplaintNumber(),
                    "Student reopened complaint: " + reason,
                    NotificationType.COMPLAINT,
                    complaint.getId(),
                    "/maintenance/work-orders"
            );
        }

        return mapToDetailResponse(saved);
    }

    @Transactional
    public void addComment(Long id, AddCommentRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        Long userId = SecurityUtils.getCurrentUserId();
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ComplaintComment comment = ComplaintComment.builder()
                .complaint(complaint)
                .author(author)
                .comment(request.getComment())
                .isInternalStaffOnly(request.getIsInternalStaffOnly() != null ? request.getIsInternalStaffOnly() : false)
                .build();

        complaintCommentRepository.save(comment);
    }

    @Transactional(readOnly = true)
    public DuplicateIssueResponse detectDuplicates(Long categoryId, Long hostelId, Long blockId) {
        LocalDateTime since = LocalDateTime.now().minusHours(48);
        List<Complaint> similar = complaintRepository.findRecentSimilarInBlock(hostelId, blockId, categoryId, since, -1L);

        if (similar.isEmpty()) {
            return DuplicateIssueResponse.builder().isPotentialDuplicate(false).build();
        }

        Complaint root = similar.get(0);
        List<String> affectedRooms = similar.stream()
                .map(c -> c.getRoom() != null ? c.getRoom().getRoomNumber() : "Common Area")
                .distinct()
                .collect(Collectors.toList());

        return DuplicateIssueResponse.builder()
                .isPotentialDuplicate(true)
                .rootComplaintId(root.getId())
                .rootComplaintTitle(root.getTitle())
                .affectedRoomsCount(affectedRooms.size())
                .blockName(root.getBlock().getName())
                .categoryName(root.getCategory().getName())
                .message("Common issue detected in Block " + root.getBlock().getName() + " affecting " + affectedRooms.size() + " rooms.")
                .affectedRoomNumbers(affectedRooms)
                .build();
    }

    public ComplaintDetailResponse mapToDetailResponse(Complaint c) {
        List<ComplaintAttachment> attachments = complaintAttachmentRepository.findByComplaintId(c.getId());
        List<ComplaintComment> comments = complaintCommentRepository.findByComplaintIdOrderByCreatedAtAsc(c.getId());
        List<Escalation> escalations = escalationRepository.findByComplaintIdOrderByEscalatedAtDesc(c.getId());

        boolean isOverdue = LocalDateTime.now().isAfter(c.getSlaDeadline())
                && c.getStatus() != ComplaintStatus.RESOLVED
                && c.getStatus() != ComplaintStatus.STUDENT_CONFIRMED
                && c.getStatus() != ComplaintStatus.CLOSED;

        return ComplaintDetailResponse.builder()
                .id(c.getId())
                .complaintNumber(c.getComplaintNumber())
                .studentId(c.getStudent().getId())
                .studentName(c.getStudent().getUser().getFullName())
                .studentRollNo(c.getStudent().getStudentId())
                .studentPhone(c.getStudent().getUser().getPhone())
                .hostelId(c.getHostel().getId())
                .hostelName(c.getHostel().getName())
                .blockId(c.getBlock().getId())
                .blockName(c.getBlock().getName())
                .roomId(c.getRoom() != null ? c.getRoom().getId() : null)
                .roomNumber(c.getRoom() != null ? c.getRoom().getRoomNumber() : "Common Area")
                .categoryId(c.getCategory().getId())
                .categoryName(c.getCategory().getName())
                .title(c.getTitle())
                .description(c.getDescription())
                .priority(c.getPriority())
                .status(c.getStatus())
                .slaDeadline(c.getSlaDeadline())
                .isOverdue(isOverdue)
                .assignedToUserId(c.getAssignedTo() != null ? c.getAssignedTo().getId() : null)
                .assignedToName(c.getAssignedTo() != null ? c.getAssignedTo().getFullName() : "Unassigned")
                .escalationLevel(c.getEscalationLevel())
                .isRecurring(c.getIsRecurring())
                .isDuplicate(c.getIsDuplicate())
                .duplicateGroupId(c.getDuplicateGroupId())
                .resolutionNotes(c.getResolutionNotes())
                .resolutionProofUrl(c.getResolutionProofUrl())
                .resolvedAt(c.getResolvedAt())
                .studentConfirmedAt(c.getStudentConfirmedAt())
                .reopenedReason(c.getReopenedReason())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .attachments(attachments.stream().map(a -> ComplaintDetailResponse.AttachmentDto.builder()
                        .id(a.getId())
                        .fileUrl(a.getFileUrl())
                        .fileName(a.getFileName())
                        .fileType(a.getFileType())
                        .createdAt(a.getCreatedAt())
                        .build()).collect(Collectors.toList()))
                .comments(comments.stream().map(cm -> ComplaintDetailResponse.CommentDto.builder()
                        .id(cm.getId())
                        .authorName(cm.getAuthor().getFullName())
                        .authorRole(cm.getAuthor().getRole().name())
                        .comment(cm.getComment())
                        .isInternalStaffOnly(cm.getIsInternalStaffOnly())
                        .createdAt(cm.getCreatedAt())
                        .build()).collect(Collectors.toList()))
                .escalations(escalations.stream().map(e -> ComplaintDetailResponse.EscalationDto.builder()
                        .id(e.getId())
                        .level(e.getEscalationLevel())
                        .previousAssigneeName(e.getPreviousAssignee() != null ? e.getPreviousAssignee().getFullName() : "None")
                        .newAssigneeName(e.getNewAssignee() != null ? e.getNewAssignee().getFullName() : "Warden / Admin")
                        .reason(e.getReason())
                        .source(e.getEscalationSource().name())
                        .escalatedAt(e.getEscalatedAt())
                        .build()).collect(Collectors.toList()))
                .build();
    }
}
