package com.hostel360.dto.response;

import com.hostel360.entity.enums.ComplaintStatus;
import com.hostel360.entity.enums.PriorityLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintDetailResponse {
    private Long id;
    private String complaintNumber;
    private Long studentId;
    private String studentName;
    private String studentRollNo;
    private String studentPhone;
    private Long hostelId;
    private String hostelName;
    private Long blockId;
    private String blockName;
    private Long roomId;
    private String roomNumber;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private PriorityLevel priority;
    private ComplaintStatus status;
    private LocalDateTime slaDeadline;
    private Boolean isOverdue;
    private Long assignedToUserId;
    private String assignedToName;
    private Integer escalationLevel;
    private Boolean isRecurring;
    private Boolean isDuplicate;
    private Long duplicateGroupId;
    private String resolutionNotes;
    private String resolutionProofUrl;
    private LocalDateTime resolvedAt;
    private LocalDateTime studentConfirmedAt;
    private String reopenedReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<AttachmentDto> attachments;
    private List<CommentDto> comments;
    private List<EscalationDto> escalations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachmentDto {
        private Long id;
        private String fileUrl;
        private String fileName;
        private String fileType;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentDto {
        private Long id;
        private String authorName;
        private String authorRole;
        private String comment;
        private Boolean isInternalStaffOnly;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EscalationDto {
        private Long id;
        private Integer level;
        private String previousAssigneeName;
        private String newAssigneeName;
        private String reason;
        private String source;
        private LocalDateTime escalatedAt;
    }
}
