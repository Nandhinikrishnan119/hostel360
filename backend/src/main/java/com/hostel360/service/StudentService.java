package com.hostel360.service;

import com.hostel360.dto.response.StudentDetailResponse;
import com.hostel360.entity.Student;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.StudentRepository;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public StudentDetailResponse getMyProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for active user"));

        return mapToStudentDetailResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentDetailResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        return mapToStudentDetailResponse(student);
    }

    @Transactional(readOnly = true)
    public Page<StudentDetailResponse> searchStudents(String query, Long hostelId, Long deptId, Pageable pageable) {
        return studentRepository.searchStudents(query, hostelId, deptId, pageable)
                .map(this::mapToStudentDetailResponse);
    }

    private StudentDetailResponse mapToStudentDetailResponse(Student student) {
        List<String> roommates = List.of();
        if (student.getRoom() != null) {
            roommates = studentRepository.findByRoomId(student.getRoom().getId()).stream()
                    .filter(s -> !s.getId().equals(student.getId()))
                    .map(s -> s.getUser().getFullName() + " (" + s.getStudentId() + ") - Bed " + (s.getBed() != null ? s.getBed().getBedLabel() : "-"))
                    .collect(Collectors.toList());
        }

        return StudentDetailResponse.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .studentId(student.getStudentId())
                .fullName(student.getUser().getFullName())
                .email(student.getUser().getEmail())
                .phone(student.getUser().getPhone())
                .avatarUrl(student.getUser().getAvatarUrl())
                .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : null)
                .departmentCode(student.getDepartment() != null ? student.getDepartment().getCode() : null)
                .yearOfStudy(student.getYearOfStudy())
                .hostelName(student.getHostel() != null ? student.getHostel().getName() : null)
                .blockName(student.getBlock() != null ? student.getBlock().getName() : null)
                .roomNumber(student.getRoom() != null ? student.getRoom().getRoomNumber() : null)
                .bedLabel(student.getBed() != null ? student.getBed().getBedLabel() : null)
                .parentName(student.getParentName())
                .parentPhone(student.getParentPhone())
                .emergencyContact(student.getEmergencyContact())
                .joiningDate(student.getJoiningDate())
                .bloodGroup(student.getBloodGroup())
                .roommates(roommates)
                .build();
    }
}
