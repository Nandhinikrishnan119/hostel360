package com.hostel360.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class LateEntrySubmitRequest {

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Expected time is required")
    private LocalTime expectedTime;

    @NotBlank(message = "Reason is required")
    private String reason;
}
