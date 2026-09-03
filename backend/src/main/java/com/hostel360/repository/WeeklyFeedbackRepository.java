package com.hostel360.repository;

import com.hostel360.entity.WeeklyFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyFeedbackRepository extends JpaRepository<WeeklyFeedback, Long> {
    Optional<WeeklyFeedback> findByStudentIdAndWeekStartDate(Long studentId, LocalDate weekStartDate);
    List<WeeklyFeedback> findByHostelId(Long hostelId);
    List<WeeklyFeedback> findByStudentIdOrderByWeekStartDateDesc(Long studentId);

    @Query("SELECT AVG(w.foodScore), AVG(w.cleanlinessScore), AVG(w.wifiScore), " +
           "AVG(w.waterScore), AVG(w.securityScore), AVG(w.maintenanceScore) " +
           "FROM WeeklyFeedback w WHERE (:hostelId IS NULL OR w.hostel.id = :hostelId)")
    List<Object[]> getAveragesByHostel(@Param("hostelId") Long hostelId);
}
