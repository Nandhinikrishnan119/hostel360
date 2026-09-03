package com.hostel360.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignComplaintRequest {

    @NotNull(message = "Staff User ID is required")
    private Long staffUserId;

    private String assignmentNotes;
}
