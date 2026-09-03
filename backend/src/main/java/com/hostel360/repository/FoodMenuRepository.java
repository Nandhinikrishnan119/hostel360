package com.hostel360.repository;

import com.hostel360.entity.FoodMenu;
import com.hostel360.entity.enums.DayOfWeekEnum;
import com.hostel360.entity.enums.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodMenuRepository extends JpaRepository<FoodMenu, Long> {
    List<FoodMenu> findByHostelId(Long hostelId);
    List<FoodMenu> findByHostelIdAndDayOfWeek(Long hostelId, DayOfWeekEnum dayOfWeek);
    Optional<FoodMenu> findByHostelIdAndDayOfWeekAndMealType(Long hostelId, DayOfWeekEnum dayOfWeek, MealType mealType);
}
