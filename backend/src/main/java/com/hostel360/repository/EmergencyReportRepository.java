package com.hostel360.repository;

import com.hostel360.entity.EmergencyReport;
import com.hostel360.entity.enums.EmergencyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyReportRepository extends JpaRepository<EmergencyReport, Long> {
    List<EmergencyReport> findByStatusOrderByCreatedAtDesc(EmergencyStatus status);
    List<EmergencyReport> findAllByOrderByCreatedAtDesc();
    Long countByStatus(EmergencyStatus status);
}
