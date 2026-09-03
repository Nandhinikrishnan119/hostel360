package com.hostel360.dto.request;

import jakarta.validation.constraints.Email;
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
public class RegisterStudentRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    @NotBlank(message = "Student ID / Roll No is required")
    private String studentId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Year of study is required")
    private Integer yearOfStudy;

    private Long hostelId;
    private Long blockId;
    private Long roomId;
    private Long bedId;

    private String parentName;
    private String parentPhone;
    private String emergencyContact;
    private LocalDate joiningDate;
    private String bloodGroup;
}
