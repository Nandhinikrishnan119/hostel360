package com.hostel360.dto.request;

import com.hostel360.entity.enums.AnnouncementCategory;
import com.hostel360.entity.enums.AnnouncementPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequest {

    private Long hostelId; // null = global

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Category is required")
    private AnnouncementCategory category;

    private AnnouncementPriority priority;
    private LocalDateTime expiresAt;
}
