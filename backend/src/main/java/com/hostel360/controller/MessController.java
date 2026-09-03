package com.hostel360.controller;

import com.hostel360.dto.request.FoodComplaintRequest;
import com.hostel360.dto.request.FoodMenuDto;
import com.hostel360.dto.request.FoodRatingRequest;
import com.hostel360.dto.request.FoodReservationRequest;
import com.hostel360.dto.response.ApiResponse;
import com.hostel360.entity.FoodComplaint;
import com.hostel360.entity.FoodMenu;
import com.hostel360.entity.FoodRating;
import com.hostel360.entity.FoodReservation;
import com.hostel360.entity.enums.FoodReservationStatus;
import com.hostel360.service.MessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mess")
@RequiredArgsConstructor
@Tag(name = "Mess & Food Management", description = "Endpoints for daily/weekly menus, Keep-My-Food reservations, meal ratings, and food quality complaints")
public class MessController {

    private final MessService messService;

    @GetMapping("/menu/today")
    @Operation(summary = "Get today's menu for a hostel")
    public ResponseEntity<List<FoodMenu>> getTodayMenu(@RequestParam(defaultValue = "1") Long hostelId) {
        return ResponseEntity.ok(messService.getTodayMenu(hostelId));
    }

    @GetMapping("/menu/weekly")
    @Operation(summary = "Get full weekly menu schedule for a hostel")
    public ResponseEntity<List<FoodMenu>> getWeeklyMenu(@RequestParam(defaultValue = "1") Long hostelId) {
        return ResponseEntity.ok(messService.getWeeklyMenu(hostelId));
    }

    @PostMapping("/manage/menu")
    @PreAuthorize("hasAnyRole('MESS_MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Create or update a meal menu item")
    public ResponseEntity<FoodMenu> saveMenuItem(@Valid @RequestBody FoodMenuDto dto) {
        return ResponseEntity.ok(messService.saveMenuItem(dto));
    }

    @PostMapping("/reservations")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a 'Keep My Food' late arrival meal reservation")
    public ResponseEntity<FoodReservation> createReservation(@Valid @RequestBody FoodReservationRequest request) {
        return ResponseEntity.ok(messService.createFoodReservation(request));
    }

    @GetMapping("/reservations/my")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get current student's food reservation orders")
    public ResponseEntity<List<FoodReservation>> getMyReservations() {
        return ResponseEntity.ok(messService.getMyReservations());
    }

    @GetMapping("/manage/reservations")
    @PreAuthorize("hasAnyRole('MESS_MANAGER', 'SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get packed food reservations for a hostel and date")
    public ResponseEntity<List<FoodReservation>> getHostelReservations(
            @RequestParam Long hostelId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(messService.getHostelReservations(hostelId, date));
    }

    @PutMapping("/manage/reservations/{id}/status")
    @PreAuthorize("hasAnyRole('MESS_MANAGER', 'SUPER_ADMIN')")
    @Operation(summary = "Update food pack reservation status (APPROVED, PACKED, COLLECTED)")
    public ResponseEntity<FoodReservation> updateReservationStatus(
            @PathVariable Long id, @RequestBody Map<String, String> payload) {
        FoodReservationStatus status = FoodReservationStatus.valueOf(payload.get("status"));
        String notes = payload.get("packingNotes");
        return ResponseEntity.ok(messService.updateReservationStatus(id, status, notes));
    }

    @PostMapping("/rating")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit 1-5 star rating and feedback for a meal")
    public ResponseEntity<FoodRating> rateMeal(@Valid @RequestBody FoodRatingRequest request) {
        return ResponseEntity.ok(messService.rateMeal(request));
    }

    @PostMapping("/complaint")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Submit a food quality/hygiene complaint")
    public ResponseEntity<FoodComplaint> reportFoodComplaint(@Valid @RequestBody FoodComplaintRequest request) {
        return ResponseEntity.ok(messService.reportFoodComplaint(request));
    }

    @GetMapping("/complaints")
    @PreAuthorize("hasAnyRole('MESS_MANAGER', 'SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get food complaints for a hostel")
    public ResponseEntity<List<FoodComplaint>> getHostelFoodComplaints(@RequestParam Long hostelId) {
        return ResponseEntity.ok(messService.getHostelFoodComplaints(hostelId));
    }
}
