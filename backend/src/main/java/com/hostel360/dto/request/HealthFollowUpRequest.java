package com.hostel360.dto.request;

import com.hostel360.entity.enums.HealthConditionAssessment;
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
public class HealthFollowUpRequest {

    @NotNull(message = "Follow up date is required")
    private LocalDate followUpDate;

    @NotNull(message = "Student condition assessment is required")
    private HealthConditionAssessment studentCondition;

    @NotBlank(message = "Follow-up notes are required")
    private String notes;
}
