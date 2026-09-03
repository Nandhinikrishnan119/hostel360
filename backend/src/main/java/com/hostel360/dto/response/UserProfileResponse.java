package com.hostel360.dto.response;

import com.hostel360.entity.enums.RoleType;
import com.hostel360.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String avatarUrl;
    private RoleType role;
    private UserStatus status;

    // Student specific context (if user is a student)
    private Long studentProfileId;
    private String studentId;
    private String departmentName;
    private Integer yearOfStudy;
    private Long hostelId;
    private String hostelName;
    private Long blockId;
    private String blockName;
    private Long roomId;
    private String roomNumber;
    private String bedLabel;

    // Staff specific context (if user is staff)
    private String designation;
    private String assignedHostelName;
}
