package com.hostel360.controller;

import com.hostel360.dto.request.SuggestionRequest;
import com.hostel360.dto.request.WeeklyFeedbackRequest;
import com.hostel360.entity.Suggestion;
import com.hostel360.entity.WeeklyFeedback;
import com.hostel360.entity.enums.SuggestionStatus;
import com.hostel360.service.SuggestionFeedbackService;
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
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
@Tag(name = "Suggestions & Weekly Feedback", description = "Endpoints for student idea proposals, upvoting, and weekly satisfaction audits")
public class SuggestionFeedbackController {

    private final SuggestionFeedbackService suggestionFeedbackService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit student suggestion or amenity proposal (supports anonymous)")
    public ResponseEntity<Suggestion> submitSuggestion(@Valid @RequestBody SuggestionRequest request) {
        return ResponseEntity.ok(suggestionFeedbackService.submitSuggestion(request));
    }

    @GetMapping
    @Operation(summary = "Get list of suggestions sorted by upvotes")
    public ResponseEntity<List<Suggestion>> getSuggestions(@RequestParam(required = false) SuggestionStatus status) {
        return ResponseEntity.ok(suggestionFeedbackService.getSuggestions(status));
    }

    @PostMapping("/{id}/upvote")
    @Operation(summary = "Upvote an idea or proposal")
    public ResponseEntity<Suggestion> upvoteSuggestion(@PathVariable Long id) {
        return ResponseEntity.ok(suggestionFeedbackService.upvoteSuggestion(id));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Update suggestion status (UNDER_REVIEW, ACCEPTED, IMPLEMENTED) with admin feedback")
    public ResponseEntity<Suggestion> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        SuggestionStatus status = SuggestionStatus.valueOf(payload.get("status"));
        String feedback = payload.get("adminFeedback");
        return ResponseEntity.ok(suggestionFeedbackService.updateSuggestionStatus(id, status, feedback));
    }

    @PostMapping("/feedback/weekly")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit weekly hostel satisfaction rating (Food, Wifi, Cleanliness, Water, Security)")
    public ResponseEntity<WeeklyFeedback> submitWeeklyFeedback(@Valid @RequestBody WeeklyFeedbackRequest request) {
        return ResponseEntity.ok(suggestionFeedbackService.submitWeeklyFeedback(request));
    }

    @GetMapping("/feedback/weekly")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get weekly feedback entries for a hostel")
    public ResponseEntity<List<WeeklyFeedback>> getWeeklyFeedback(@RequestParam Long hostelId) {
        return ResponseEntity.ok(suggestionFeedbackService.getWeeklyFeedbackForHostel(hostelId));
    }
}
