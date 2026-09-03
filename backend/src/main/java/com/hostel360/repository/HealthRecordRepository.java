package com.hostel360.repository;

import com.hostel360.entity.HealthRecord;
import com.hostel360.entity.enums.HealthStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByStudentIdOrderByReportedDateDesc(Long studentId);
    List<HealthRecord> findByStudentHostelIdOrderByReportedDateDesc(Long hostelId);
    List<HealthRecord> findByStatusIn(List<HealthStatus> statuses);

    @Query("SELECT h FROM HealthRecord h WHERE h.nextFollowUpDate <= :date AND h.status != 'RECOVERED'")
    List<HealthRecord> findDueFollowUps(@Param("date") LocalDate date);

    Long countByStatus(HealthStatus status);
}
