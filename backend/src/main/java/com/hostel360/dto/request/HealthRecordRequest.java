package com.hostel360.dto.request;

import com.hostel360.entity.enums.HealthStatus;
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
public class HealthRecordRequest {

    @NotBlank(message = "Symptoms description is required")
    private String symptoms;

    @NotBlank(message = "Illness type is required (e.g. Fever, Flu, Sprain)")
    private String illnessType;

    @NotNull(message = "Reported date is required")
    private LocalDate reportedDate;

    private HealthStatus status;
    private Boolean hospitalVisit = false;
    private String hospitalName;
    private String doctorNotes;
    private LocalDate expectedRecoveryDate;
    private LocalDate nextFollowUpDate;
}
