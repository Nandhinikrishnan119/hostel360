package com.hostel360.dto.request;

import com.hostel360.entity.enums.EmergencyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyReportRequest {

    @NotNull(message = "Category is required")
    private EmergencyCategory category;

    @NotBlank(message = "Emergency description is required")
    private String description;

    private Long hostelId;
    private Long blockId;
    private Long roomId;
}
