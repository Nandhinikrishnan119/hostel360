package com.hostel360.repository;

import com.hostel360.entity.LeaveRequest;
import com.hostel360.entity.enums.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStudentHostelIdAndStatus(Long hostelId, LeaveStatus status);
    Long countByStatus(LeaveStatus status);

    @Query("SELECT l FROM LeaveRequest l WHERE l.status = 'APPROVED_WARDEN' AND :today BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findActiveApprovedLeavesForSecurity(@Param("today") LocalDate today);
}
