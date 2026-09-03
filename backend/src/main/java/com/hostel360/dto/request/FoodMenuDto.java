package com.hostel360.dto.request;

import com.hostel360.entity.enums.DayOfWeekEnum;
import com.hostel360.entity.enums.MealType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodMenuDto {

    private Long id;

    @NotNull(message = "Hostel ID is required")
    private Long hostelId;

    @NotNull(message = "Day of week is required")
    private DayOfWeekEnum dayOfWeek;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    private String menuTitle;

    @NotBlank(message = "Menu items are required")
    private String items;

    private String specialDietOptions;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isPublished = true;
}
