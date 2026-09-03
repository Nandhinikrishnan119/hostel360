package com.hostel360.service;

import com.hostel360.entity.Complaint;
import com.hostel360.entity.Escalation;
import com.hostel360.entity.User;
import com.hostel360.entity.enums.ComplaintStatus;
import com.hostel360.entity.enums.EscalationSource;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.entity.enums.RoleType;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.ComplaintRepository;
import com.hostel360.repository.EscalationRepository;
import com.hostel360.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EscalationService {

    private final ComplaintRepository complaintRepository;
    private final EscalationRepository escalationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public void processOverdueComplaints() {
        LocalDateTime now = LocalDateTime.now();
        List<Complaint> overdueComplaints = complaintRepository.findOverdueComplaints(now);

        for (Complaint complaint : overdueComplaints) {
            try {
                escalateComplaintSla(complaint, now);
            } catch (Exception e) {
                log.error("Failed to auto-escalate complaint ID {}", complaint.getId(), e);
            }
        }
    }

    private void escalateComplaintSla(Complaint complaint, LocalDateTime now) {
        int currentLevel = complaint.getEscalationLevel();
        LocalDateTime deadline = complaint.getSlaDeadline();

        User previousAssignee = complaint.getAssignedTo();
        User newAssignee = previousAssignee;
        String reason = "";
        int targetLevel = currentLevel;

        if (currentLevel == 0) {
            // Level 0 -> Level 1 (Maintenance Supervisor / Lead)
            targetLevel = 1;
            reason = "Initial SLA of " + complaint.getCategory().getName() + " (" + complaint.getPriority() + " priority) breached.";
            List<User> supervisors = userRepository.findByRole(RoleType.ROLE_MAINTENANCE_STAFF);
            if (!supervisors.isEmpty()) {
                newAssignee = supervisors.get(0);
            }
        } else if (currentLevel == 1 && now.isAfter(deadline.plusHours(12))) {
            // Level 1 -> Level 2 (Hostel Warden)
            targetLevel = 2;
            reason = "Level 1 Overdue (>12h past SLA): Escalated to Hostel Warden.";
            if (complaint.getHostel().getWarden() != null) {
                newAssignee = complaint.getHostel().getWarden();
            }
        } else if (currentLevel == 2 && now.isAfter(deadline.plusHours(24))) {
            // Level 2 -> Level 3 (Super Admin / Chief Administrator)
            targetLevel = 3;
            reason = "Level 2 Critical Breach (>24h past SLA): Escalated to Chief Administrator.";
            List<User> admins = userRepository.findByRole(RoleType.ROLE_SUPER_ADMIN);
            if (!admins.isEmpty()) {
                newAssignee = admins.get(0);
            }
        }

        if (targetLevel > currentLevel) {
            complaint.setEscalationLevel(targetLevel);
            complaint.setStatus(ComplaintStatus.ESCALATED);
            if (newAssignee != null) {
                complaint.setAssignedTo(newAssignee);
            }
            complaintRepository.save(complaint);

            Escalation escalation = Escalation.builder()
                    .complaint(complaint)
                    .escalationLevel(targetLevel)
                    .previousAssignee(previousAssignee)
                    .newAssignee(newAssignee)
                    .escalationSource(EscalationSource.SYSTEM_SLA)
                    .reason(reason)
                    .escalatedAt(now)
                    .build();
            escalationRepository.save(escalation);

            // Dispatch notification
            if (newAssignee != null) {
                notificationService.sendNotification(
                        newAssignee.getId(),
                        "⚠️ Auto-Escalated: #" + complaint.getComplaintNumber() + " (Level " + targetLevel + ")",
                        reason + " Ticket: " + complaint.getTitle(),
                        NotificationType.COMPLAINT,
                        complaint.getId(),
                        "/warden/complaints"
                );
            }

            auditLogService.logAction(
                    newAssignee,
                    "AUTO_ESCALATION_LEVEL_" + targetLevel,
                    "Complaint",
                    complaint.getId(),
                    "Level " + currentLevel,
                    "Level " + targetLevel + " (" + reason + ")",
                    "SYSTEM"
            );

            log.info("Complaint #{} successfully escalated to Level {}", complaint.getComplaintNumber(), targetLevel);
        }
    }

    @Transactional
    public void manualEscalate(Long complaintId, String reason) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", complaintId));

        int newLevel = Math.min(3, complaint.getEscalationLevel() + 1);
        User prev = complaint.getAssignedTo();

        complaint.setEscalationLevel(newLevel);
        complaint.setStatus(ComplaintStatus.ESCALATED);
        complaintRepository.save(complaint);

        Escalation escalation = Escalation.builder()
                .complaint(complaint)
                .escalationLevel(newLevel)
                .previousAssignee(prev)
                .newAssignee(complaint.getHostel().getWarden())
                .escalationSource(EscalationSource.MANUAL_WARDEN)
                .reason(reason != null ? reason : "Manual escalation by Warden")
                .escalatedAt(LocalDateTime.now())
                .build();
        escalationRepository.save(escalation);
    }
}
