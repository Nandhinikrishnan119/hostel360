package com.hostel360.repository;

import com.hostel360.entity.FoodReservation;
import com.hostel360.entity.enums.FoodReservationStatus;
import com.hostel360.entity.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodReservationRepository extends JpaRepository<FoodReservation, Long> {
    List<FoodReservation> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<FoodReservation> findByHostelIdAndMealDateOrderByExpectedArrivalTimeAsc(Long hostelId, LocalDate mealDate);
    List<FoodReservation> findByHostelIdAndMealDateAndMealType(Long hostelId, LocalDate mealDate, MealType mealType);
    List<FoodReservation> findByStatus(FoodReservationStatus status);
    Long countByStatus(FoodReservationStatus status);
}
