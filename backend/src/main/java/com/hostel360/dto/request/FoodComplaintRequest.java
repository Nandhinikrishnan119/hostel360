package com.hostel360.dto.request;

import com.hostel360.entity.enums.FoodIssueType;
import com.hostel360.entity.enums.MealType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodComplaintRequest {

    @NotNull(message = "Meal date is required")
    private LocalDate mealDate;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    @NotNull(message = "Issue type is required")
    private FoodIssueType issueType;

    @NotBlank(message = "Description is required")
    private String description;
}
