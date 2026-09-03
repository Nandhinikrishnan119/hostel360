package com.hostel360.repository;

import com.hostel360.entity.FoodRating;
import com.hostel360.entity.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRatingRepository extends JpaRepository<FoodRating, Long> {
    Optional<FoodRating> findByStudentIdAndMealDateAndMealType(Long studentId, LocalDate mealDate, MealType mealType);
    List<FoodRating> findByHostelIdAndMealDate(Long hostelId, LocalDate mealDate);
    List<FoodRating> findByStudentId(Long studentId);

    @Query("SELECT AVG(f.rating) FROM FoodRating f WHERE f.hostel.id = :hostelId")
    Double getAverageFoodRatingByHostel(@Param("hostelId") Long hostelId);

    @Query("SELECT AVG(f.rating) FROM FoodRating f")
    Double getOverallAverageFoodRating();
}
