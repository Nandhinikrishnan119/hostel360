package com.hostel360.dto.request;

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
public class ParcelRegisterRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotBlank(message = "Courier name is required")
    private String courierName;

    private String trackingNumber;
    private String remarks;
}
