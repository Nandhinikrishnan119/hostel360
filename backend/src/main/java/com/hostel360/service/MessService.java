package com.hostel360.service;

import com.hostel360.dto.request.FoodComplaintRequest;
import com.hostel360.dto.request.FoodMenuDto;
import com.hostel360.dto.request.FoodRatingRequest;
import com.hostel360.dto.request.FoodReservationRequest;
import com.hostel360.entity.*;
import com.hostel360.entity.enums.DayOfWeekEnum;
import com.hostel360.entity.enums.FoodReservationStatus;
import com.hostel360.entity.enums.MealType;
import com.hostel360.entity.enums.NotificationType;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.*;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessService {

    private final FoodMenuRepository foodMenuRepository;
    private final FoodRatingRepository foodRatingRepository;
    private final FoodComplaintRepository foodComplaintRepository;
    private final FoodReservationRepository foodReservationRepository;
    private final HostelRepository hostelRepository;
    private final StudentRepository studentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional(readOnly = true)
    public List<FoodMenu> getWeeklyMenu(Long hostelId) {
        return foodMenuRepository.findByHostelId(hostelId);
    }

    @Transactional(readOnly = true)
    public List<FoodMenu> getTodayMenu(Long hostelId) {
        String dayName = LocalDate.now().getDayOfWeek().name();
        DayOfWeekEnum day = DayOfWeekEnum.valueOf(dayName);
        return foodMenuRepository.findByHostelIdAndDayOfWeek(hostelId, day);
    }

    @Transactional
    public FoodMenu saveMenuItem(FoodMenuDto dto) {
        Hostel hostel = hostelRepository.findById(dto.getHostelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hostel", "id", dto.getHostelId()));

        FoodMenu menu = foodMenuRepository.findByHostelIdAndDayOfWeekAndMealType(dto.getHostelId(), dto.getDayOfWeek(), dto.getMealType())
                .orElse(FoodMenu.builder()
                        .hostel(hostel)
                        .dayOfWeek(dto.getDayOfWeek())
                        .mealType(dto.getMealType())
                        .build());

        menu.setMenuTitle(dto.getMenuTitle());
        menu.setItems(dto.getItems());
        menu.setSpecialDietOptions(dto.getSpecialDietOptions());
        menu.setStartTime(dto.getStartTime());
        menu.setEndTime(dto.getEndTime());
        menu.setIsPublished(dto.getIsPublished() != null ? dto.getIsPublished() : true);

        return foodMenuRepository.save(menu);
    }

    @Transactional
    public FoodReservation createFoodReservation(FoodReservationRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        FoodReservation reservation = FoodReservation.builder()
                .student(student)
                .hostel(student.getHostel())
                .mealDate(request.getMealDate())
                .mealType(request.getMealType())
                .expectedArrivalTime(request.getExpectedArrivalTime())
                .reason(request.getReason())
                .status(FoodReservationStatus.PENDING)
                .build();

        FoodReservation saved = foodReservationRepository.save(reservation);
        auditLogService.logAction(student.getUser(), "KEEP_MY_FOOD_RESERVATION", "FoodReservation", saved.getId(), null, request.getMealType().name(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<FoodReservation> getMyReservations() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        return foodReservationRepository.findByStudentIdOrderByCreatedAtDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<FoodReservation> getHostelReservations(Long hostelId, LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        return foodReservationRepository.findByHostelIdAndMealDateOrderByExpectedArrivalTimeAsc(hostelId, queryDate);
    }

    @Transactional
    public FoodReservation updateReservationStatus(Long id, FoodReservationStatus status, String packingNotes) {
        FoodReservation reservation = foodReservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodReservation", "id", id));

        reservation.setStatus(status);
        if (packingNotes != null) {
            reservation.setPackingNotes(packingNotes);
        }

        FoodReservation saved = foodReservationRepository.save(reservation);

        // Notify student if status is PACKED / APPROVED
        notificationService.sendNotification(
                reservation.getStudent().getUser().getId(),
                "Food Box Update: " + status,
                "Your " + reservation.getMealType() + " pack status changed to: " + status,
                NotificationType.MESS,
                reservation.getId(),
                "/student/mess"
        );

        return saved;
    }

    @Transactional
    public FoodRating rateMeal(FoodRatingRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        FoodRating rating = foodRatingRepository.findByStudentIdAndMealDateAndMealType(student.getId(), request.getMealDate(), request.getMealType())
                .orElse(FoodRating.builder()
                        .student(student)
                        .hostel(student.getHostel())
                        .mealDate(request.getMealDate())
                        .mealType(request.getMealType())
                        .build());

        rating.setRating(request.getRating());
        rating.setComments(request.getComments());

        return foodRatingRepository.save(rating);
    }

    @Transactional
    public FoodComplaint reportFoodComplaint(FoodComplaintRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        FoodComplaint complaint = FoodComplaint.builder()
                .student(student)
                .hostel(student.getHostel())
                .mealDate(request.getMealDate())
                .mealType(request.getMealType())
                .issueType(request.getIssueType())
                .description(request.getDescription())
                .status("REPORTED")
                .build();

        return foodComplaintRepository.save(complaint);
    }

    @Transactional(readOnly = true)
    public List<FoodComplaint> getHostelFoodComplaints(Long hostelId) {
        return foodComplaintRepository.findByHostelIdOrderByCreatedAtDesc(hostelId);
    }
}
