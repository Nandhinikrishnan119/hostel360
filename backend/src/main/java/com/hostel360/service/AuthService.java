package com.hostel360.service;

import com.hostel360.dto.request.LoginRequest;
import com.hostel360.dto.request.RegisterStudentRequest;
import com.hostel360.dto.response.JwtAuthResponse;
import com.hostel360.dto.response.UserProfileResponse;
import com.hostel360.entity.*;
import com.hostel360.entity.enums.RoleType;
import com.hostel360.entity.enums.RoomStatus;
import com.hostel360.entity.enums.UserStatus;
import com.hostel360.exception.BadRequestException;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.*;
import com.hostel360.security.JwtTokenProvider;
import com.hostel360.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final StaffProfileRepository staffProfileRepository;
    private final DepartmentRepository departmentRepository;
    private final HostelRepository hostelRepository;
    private final BlockRepository blockRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        String usernameOrEmail = loginRequest.getUsernameOrEmail().trim();
        String password = loginRequest.getPassword().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                usernameOrEmail,
                password
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserProfileResponse userProfile = buildUserProfileResponse(user);

        auditLogService.logAction(user, "USER_LOGIN", "User", user.getId(), null, "SUCCESS", "127.0.0.1");

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .user(userProfile)
                .build();
    }

    @Transactional
    public UserProfileResponse registerStudent(RegisterStudentRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already in use!");
        }

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(RoleType.ROLE_STUDENT)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        Hostel hostel = request.getHostelId() != null ? hostelRepository.findById(request.getHostelId()).orElse(null) : null;
        Block block = request.getBlockId() != null ? blockRepository.findById(request.getBlockId()).orElse(null) : null;
        Room room = request.getRoomId() != null ? roomRepository.findById(request.getRoomId()).orElse(null) : null;
        Bed bed = request.getBedId() != null ? bedRepository.findById(request.getBedId()).orElse(null) : null;

        if (room != null) {
            if (room.getCurrentOccupancy() >= room.getCapacity()) {
                throw new BadRequestException("Room " + room.getRoomNumber() + " is already at full capacity!");
            }
            room.setCurrentOccupancy(room.getCurrentOccupancy() + 1);
            if (room.getCurrentOccupancy() >= room.getCapacity()) {
                room.setStatus(RoomStatus.FULL);
            }
            roomRepository.save(room);
        }

        if (bed != null) {
            bed.setIsOccupied(true);
            bedRepository.save(bed);
        }

        Student student = Student.builder()
                .user(savedUser)
                .studentId(request.getStudentId())
                .department(dept)
                .yearOfStudy(request.getYearOfStudy())
                .hostel(hostel)
                .block(block)
                .room(room)
                .bed(bed)
                .parentName(request.getParentName())
                .parentPhone(request.getParentPhone())
                .emergencyContact(request.getEmergencyContact())
                .joiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now())
                .bloodGroup(request.getBloodGroup())
                .build();

        studentRepository.save(student);

        auditLogService.logAction(savedUser, "STUDENT_REGISTERED", "Student", student.getId(), null, student.getStudentId(), "127.0.0.1");

        return buildUserProfileResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new ResourceNotFoundException("No active user session found");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return buildUserProfileResponse(user);
    }

    public UserProfileResponse buildUserProfileResponse(User user) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .status(user.getStatus());

        if (user.getRole() == RoleType.ROLE_STUDENT) {
            studentRepository.findByUserId(user.getId()).ifPresent(student -> {
                builder.studentProfileId(student.getId())
                        .studentId(student.getStudentId())
                        .departmentName(student.getDepartment() != null ? student.getDepartment().getName() : null)
                        .yearOfStudy(student.getYearOfStudy());

                if (student.getHostel() != null) {
                    builder.hostelId(student.getHostel().getId())
                            .hostelName(student.getHostel().getName());
                }
                if (student.getBlock() != null) {
                    builder.blockId(student.getBlock().getId())
                            .blockName(student.getBlock().getName());
                }
                if (student.getRoom() != null) {
                    builder.roomId(student.getRoom().getId())
                            .roomNumber(student.getRoom().getRoomNumber());
                }
                if (student.getBed() != null) {
                    builder.bedLabel(student.getBed().getBedLabel());
                }
            });
        } else {
            staffProfileRepository.findByUserId(user.getId()).ifPresent(staff -> {
                builder.designation(staff.getDesignation());
                if (staff.getAssignedHostel() != null) {
                    builder.hostelId(staff.getAssignedHostel().getId())
                            .assignedHostelName(staff.getAssignedHostel().getName());
                }
            });
        }

        return builder.build();
    }
}
