package com.hostel360.dto.request;

import com.hostel360.entity.enums.PriorityLevel;
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
public class CreateComplaintRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private PriorityLevel priority; // optional, falls back to category default

    private Long hostelId; // optional, auto-inferred from logged in student
    private Long blockId;  // optional, auto-inferred from logged in student
    private Long roomId;   // optional, auto-inferred from logged in student
}
