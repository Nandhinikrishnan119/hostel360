package com.hostel360.service;

import com.hostel360.dto.request.HealthFollowUpRequest;
import com.hostel360.dto.request.HealthRecordRequest;
import com.hostel360.entity.HealthFollowUp;
import com.hostel360.entity.HealthRecord;
import com.hostel360.entity.Student;
import com.hostel360.entity.User;
import com.hostel360.entity.enums.HealthStatus;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.HealthFollowUpRepository;
import com.hostel360.repository.HealthRecordRepository;
import com.hostel360.repository.StudentRepository;
import com.hostel360.repository.UserRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthWelfareService {

    private final HealthRecordRepository healthRecordRepository;
    private final HealthFollowUpRepository healthFollowUpRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public HealthRecord reportHealthStatus(HealthRecordRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        HealthRecord record = HealthRecord.builder()
                .student(student)
                .symptoms(request.getSymptoms())
                .illnessType(request.getIllnessType())
                .reportedDate(request.getReportedDate())
                .status(request.getStatus() != null ? request.getStatus() : HealthStatus.CURRENTLY_UNWELL)
                .hospitalVisit(request.getHospitalVisit() != null ? request.getHospitalVisit() : false)
                .hospitalName(request.getHospitalName())
                .doctorNotes(request.getDoctorNotes())
                .expectedRecoveryDate(request.getExpectedRecoveryDate())
                .nextFollowUpDate(request.getNextFollowUpDate() != null ? request.getNextFollowUpDate() : LocalDate.now().plusDays(1))
                .build();

        HealthRecord saved = healthRecordRepository.save(record);

        // Alert Hostel Warden
        if (student.getHostel() != null && student.getHostel().getWarden() != null) {
            notificationService.sendNotification(
                    student.getHostel().getWarden().getId(),
                    "🏥 Student Health Report: " + student.getUser().getFullName(),
                    "Reported " + record.getIllnessType() + " in Room " + (student.getRoom() != null ? student.getRoom().getRoomNumber() : "-") + (record.getHospitalVisit() ? " [Hospital Visit]" : ""),
                    NotificationType.HEALTH,
                    saved.getId(),
                    "/warden/welfare"
            );
        }

        auditLogService.logAction(student.getUser(), "REPORT_HEALTH_CONDITION", "HealthRecord", saved.getId(), null, saved.getIllnessType(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<HealthRecord> getMyHealthRecords() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return healthRecordRepository.findByStudentIdOrderByReportedDateDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<HealthRecord> getActiveWelfareCases(Long hostelId) {
        if (hostelId != null) {
            return healthRecordRepository.findByStudentHostelIdOrderByReportedDateDesc(hostelId);
        }
        return healthRecordRepository.findAll();
    }

    @Transactional
    public HealthFollowUp recordFollowUp(Long healthRecordId, HealthFollowUpRequest request) {
        HealthRecord record = healthRecordRepository.findById(healthRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("HealthRecord", "id", healthRecordId));

        Long userId = SecurityUtils.getCurrentUserId();
        User warden = userRepository.findById(userId).orElse(null);

        HealthFollowUp followUp = HealthFollowUp.builder()
                .healthRecord(record)
                .warden(warden)
                .followUpDate(request.getFollowUpDate())
                .studentCondition(request.getStudentCondition())
                .notes(request.getNotes())
                .build();

        HealthFollowUp saved = healthFollowUpRepository.save(followUp);

        // Update record status based on condition
        switch (request.getStudentCondition()) {
            case RECOVERED -> record.setStatus(HealthStatus.RECOVERED);
            case STILL_UNWELL -> record.setStatus(HealthStatus.CURRENTLY_UNWELL);
            case FEELING_BETTER -> record.setStatus(HealthStatus.RECOVERING);
            case NEEDS_FURTHER_SUPPORT -> record.setStatus(HealthStatus.REQUIRES_ATTENTION);
        }
        healthRecordRepository.save(record);

        auditLogService.logAction(warden, "RECORD_HEALTH_FOLLOWUP", "HealthFollowUp", saved.getId(), null, request.getStudentCondition().name(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<HealthFollowUp> getFollowUpsForRecord(Long healthRecordId) {
        return healthFollowUpRepository.findByHealthRecordIdOrderByFollowUpDateDesc(healthRecordId);
    }
}
