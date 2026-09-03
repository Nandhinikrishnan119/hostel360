package com.hostel360.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class WeeklyFeedbackRequest {

    @NotNull(message = "Week start date is required")
    private LocalDate weekStartDate;

    @NotNull @Min(1) @Max(5)
    private Integer foodScore;

    @NotNull @Min(1) @Max(5)
    private Integer cleanlinessScore;

    @NotNull @Min(1) @Max(5)
    private Integer wifiScore;

    @NotNull @Min(1) @Max(5)
    private Integer waterScore;

    @NotNull @Min(1) @Max(5)
    private Integer securityScore;

    @NotNull @Min(1) @Max(5)
    private Integer maintenanceScore;

    private String remarks;
}
