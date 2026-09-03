package com.hostel360.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDetailResponse {
    private Long id;
    private Long userId;
    private String studentId;
    private String fullName;
    private String email;
    private String phone;
    private String avatarUrl;
    private String departmentName;
    private String departmentCode;
    private Integer yearOfStudy;
    private String hostelName;
    private String blockName;
    private String roomNumber;
    private String bedLabel;
    private String parentName;
    private String parentPhone;
    private String emergencyContact;
    private LocalDate joiningDate;
    private String bloodGroup;
    private List<String> roommates;
}
