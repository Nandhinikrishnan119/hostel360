package com.hostel360.controller;

import com.hostel360.dto.response.StudentDetailResponse;
import com.hostel360.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/student", "/api/students"})
@RequiredArgsConstructor
@Tag(name = "Student Management", description = "Endpoints for student digital profiles and directory search")
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get detailed profile and roommates of the currently logged-in student")
    public ResponseEntity<StudentDetailResponse> getMyProfile() {
        return ResponseEntity.ok(studentService.getMyProfile());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN')")
    @Operation(summary = "Get student details by ID (Warden / Admin)")
    public ResponseEntity<StudentDetailResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'SECURITY_STAFF')")
    @Operation(summary = "Search students with pagination, filters by name, roll number, hostel, and department")
    public ResponseEntity<Page<StudentDetailResponse>> searchStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long hostelId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "studentId") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return ResponseEntity.ok(studentService.searchStudents(query, hostelId, departmentId, pageable));
    }
}
