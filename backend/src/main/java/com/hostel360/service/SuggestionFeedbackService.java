package com.hostel360.service;

import com.hostel360.dto.request.SuggestionRequest;
import com.hostel360.dto.request.WeeklyFeedbackRequest;
import com.hostel360.entity.Student;
import com.hostel360.entity.Suggestion;
import com.hostel360.entity.WeeklyFeedback;
import com.hostel360.entity.enums.SuggestionStatus;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.StudentRepository;
import com.hostel360.repository.SuggestionRepository;
import com.hostel360.repository.WeeklyFeedbackRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuggestionFeedbackService {

    private final SuggestionRepository suggestionRepository;
    private final WeeklyFeedbackRepository weeklyFeedbackRepository;
    private final StudentRepository studentRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Suggestion submitSuggestion(SuggestionRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        Suggestion suggestion = Suggestion.builder()
                .student(request.getIsAnonymous() ? null : student)
                .isAnonymous(request.getIsAnonymous())
                .category(request.getCategory())
                .title(request.getTitle())
                .description(request.getDescription())
                .upvotesCount(1)
                .status(SuggestionStatus.SUBMITTED)
                .build();

        Suggestion saved = suggestionRepository.save(suggestion);
        auditLogService.logAction(student.getUser(), "SUBMIT_SUGGESTION", "Suggestion", saved.getId(), null, saved.getTitle(), "127.0.0.1");

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Suggestion> getSuggestions(SuggestionStatus status) {
        if (status != null) {
            return suggestionRepository.findByStatus(status);
        }
        return suggestionRepository.findAllByOrderByUpvotesCountDesc();
    }

    @Transactional
    public Suggestion upvoteSuggestion(Long id) {
        Suggestion suggestion = suggestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suggestion", "id", id));

        suggestion.setUpvotesCount(suggestion.getUpvotesCount() + 1);
        return suggestionRepository.save(suggestion);
    }

    @Transactional
    public Suggestion updateSuggestionStatus(Long id, SuggestionStatus status, String adminFeedback) {
        Suggestion suggestion = suggestionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suggestion", "id", id));

        suggestion.setStatus(status);
        if (adminFeedback != null) {
            suggestion.setAdminFeedback(adminFeedback);
        }
        return suggestionRepository.save(suggestion);
    }

    // Weekly Feedback
    @Transactional
    public WeeklyFeedback submitWeeklyFeedback(WeeklyFeedbackRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        WeeklyFeedback feedback = weeklyFeedbackRepository.findByStudentIdAndWeekStartDate(student.getId(), request.getWeekStartDate())
                .orElse(WeeklyFeedback.builder()
                        .student(student)
                        .hostel(student.getHostel())
                        .weekStartDate(request.getWeekStartDate())
                        .build());

        feedback.setFoodScore(request.getFoodScore());
        feedback.setCleanlinessScore(request.getCleanlinessScore());
        feedback.setWifiScore(request.getWifiScore());
        feedback.setWaterScore(request.getWaterScore());
        feedback.setSecurityScore(request.getSecurityScore());
        feedback.setMaintenanceScore(request.getMaintenanceScore());
        feedback.setRemarks(request.getRemarks());

        return weeklyFeedbackRepository.save(feedback);
    }

    @Transactional(readOnly = true)
    public List<WeeklyFeedback> getWeeklyFeedbackForHostel(Long hostelId) {
        return weeklyFeedbackRepository.findByHostelId(hostelId);
    }
}
