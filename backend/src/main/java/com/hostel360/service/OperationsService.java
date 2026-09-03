package com.hostel360.service;

import com.hostel360.dto.request.AnnouncementRequest;
import com.hostel360.dto.request.EmergencyReportRequest;
import com.hostel360.dto.request.ParcelRegisterRequest;
import com.hostel360.entity.*;
import com.hostel360.entity.enums.*;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.*;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationsService {

    private final AnnouncementRepository announcementRepository;
    private final ParcelRepository parcelRepository;
    private final EmergencyReportRepository emergencyReportRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final HostelRepository hostelRepository;
    private final BlockRepository blockRepository;
    private final RoomRepository roomRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    // Announcements
    @Transactional
    public Announcement publishAnnouncement(AnnouncementRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Hostel hostel = request.getHostelId() != null ? hostelRepository.findById(request.getHostelId()).orElse(null) : null;

        Announcement announcement = Announcement.builder()
                .author(author)
                .hostel(hostel)
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .priority(request.getPriority() != null ? request.getPriority() : AnnouncementPriority.NORMAL)
                .expiresAt(request.getExpiresAt())
                .build();

        Announcement saved = announcementRepository.save(announcement);

        // Broadcast notification to students
        List<User> students = userRepository.findByRole(RoleType.ROLE_STUDENT);
        for (User s : students) {
            notificationService.sendNotification(
                    s.getId(),
                    "📢 " + announcement.getTitle(),
                    announcement.getContent().length() > 100 ? announcement.getContent().substring(0, 97) + "..." : announcement.getContent(),
                    NotificationType.ANNOUNCEMENT,
                    saved.getId(),
                    "/student/announcements"
            );
        }

        auditLogService.logAction(author, "PUBLISH_ANNOUNCEMENT", "Announcement", saved.getId(), null, saved.getTitle(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Announcement> getActiveAnnouncements(Long hostelId) {
        if (hostelId != null) {
            return announcementRepository.findActiveForHostel(hostelId, LocalDateTime.now());
        }
        return announcementRepository.findAllActive(LocalDateTime.now());
    }

    // Parcels
    @Transactional
    public Parcel registerParcel(ParcelRegisterRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", request.getStudentId()));

        Long securityId = SecurityUtils.getCurrentUserId();
        User securityUser = userRepository.findById(securityId).orElse(null);

        // Generate 6-digit OTP
        SecureRandom random = new SecureRandom();
        String otp = String.format("%06d", random.nextInt(1000000));

        Parcel parcel = Parcel.builder()
                .student(student)
                .courierName(request.getCourierName())
                .trackingNumber(request.getTrackingNumber())
                .securityStaff(securityUser)
                .arrivalTimestamp(LocalDateTime.now())
                .status(ParcelStatus.ARRIVED)
                .collectionOtp(otp)
                .remarks(request.getRemarks())
                .build();

        Parcel saved = parcelRepository.save(parcel);

        // Notify student with OTP
        notificationService.sendNotification(
                student.getUser().getId(),
                "📦 Parcel Arrived at Security Desk",
                "Courier: " + parcel.getCourierName() + ". Verification OTP for pickup: " + otp,
                NotificationType.PARCEL,
                saved.getId(),
                "/student/parcels"
        );

        auditLogService.logAction(securityUser, "REGISTER_PARCEL", "Parcel", saved.getId(), null, student.getStudentId(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Parcel> getMyParcels() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return parcelRepository.findByStudentIdOrderByArrivalTimestampDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<Parcel> getActiveParcels() {
        return parcelRepository.findByStatusOrderByArrivalTimestampDesc(ParcelStatus.ARRIVED);
    }

    @Transactional
    public Parcel collectParcel(Long parcelId, String otp) {
        Parcel parcel = parcelRepository.findById(parcelId)
                .orElseThrow(() -> new ResourceNotFoundException("Parcel", "id", parcelId));

        if (!parcel.getCollectionOtp().equalsIgnoreCase(otp.trim())) {
            throw new BadRequestException("Invalid collection OTP!");
        }

        parcel.setStatus(ParcelStatus.COLLECTED);
        parcel.setCollectedAt(LocalDateTime.now());
        return parcelRepository.save(parcel);
    }

    // Emergency Reports
    @Transactional
    public EmergencyReport triggerEmergency(EmergencyReportRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Hostel hostel = request.getHostelId() != null ? hostelRepository.findById(request.getHostelId()).orElse(null) : null;
        Block block = request.getBlockId() != null ? blockRepository.findById(request.getBlockId()).orElse(null) : null;
        Room room = request.getRoomId() != null ? roomRepository.findById(request.getRoomId()).orElse(null) : null;

        EmergencyReport report = EmergencyReport.builder()
                .reportedBy(reporter)
                .hostel(hostel)
                .block(block)
                .room(room)
                .category(request.getCategory())
                .description(request.getDescription())
                .status(EmergencyStatus.ACTIVE)
                .build();

        EmergencyReport saved = emergencyReportRepository.save(report);

        // Immediate broadcast to all Wardens and Security staff
        List<User> responders = userRepository.findByRole(RoleType.ROLE_WARDEN);
        responders.addAll(userRepository.findByRole(RoleType.ROLE_SECURITY_STAFF));
        responders.addAll(userRepository.findByRole(RoleType.ROLE_SUPER_ADMIN));

        for (User u : responders) {
            notificationService.sendNotification(
                    u.getId(),
                    "🚨 RED ALERT: " + request.getCategory() + " Emergency",
                    "Emergency reported by " + reporter.getFullName() + ": " + request.getDescription(),
                    NotificationType.EMERGENCY,
                    saved.getId(),
                    "/security/emergency"
            );
        }

        auditLogService.logAction(reporter, "TRIGGER_EMERGENCY", "EmergencyReport", saved.getId(), null, request.getCategory().name(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<EmergencyReport> getEmergencyReports() {
        return emergencyReportRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public EmergencyReport resolveEmergency(Long id, String actionTaken) {
        EmergencyReport report = emergencyReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyReport", "id", id));

        Long userId = SecurityUtils.getCurrentUserId();
        User responder = userRepository.findById(userId).orElse(null);

        report.setStatus(EmergencyStatus.RESOLVED);
        report.setResolvedBy(responder);
        report.setResolvedAt(LocalDateTime.now());
        report.setActionTaken(actionTaken);

        return emergencyReportRepository.save(report);
    }
}
