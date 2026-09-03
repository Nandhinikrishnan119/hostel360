package com.hostel360.repository;

import com.hostel360.entity.StaffProfile;
import com.hostel360.entity.enums.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffProfileRepository extends JpaRepository<StaffProfile, Long> {
    Optional<StaffProfile> findByUserId(Long userId);
    List<StaffProfile> findByAssignedHostelId(Long hostelId);
    List<StaffProfile> findByUserRole(RoleType role);
}
