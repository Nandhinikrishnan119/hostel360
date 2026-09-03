package com.hostel360.dto.request;

import com.hostel360.entity.enums.MealType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FoodReservationRequest {

    @NotNull(message = "Meal date is required")
    private LocalDate mealDate;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    @NotNull(message = "Expected arrival time is required")
    private LocalTime expectedArrivalTime;

    @NotNull(message = "Reason is required")
    private String reason;
}
