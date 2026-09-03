package com.hostel360.repository;

import com.hostel360.entity.LateEntry;
import com.hostel360.entity.enums.LateEntryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LateEntryRepository extends JpaRepository<LateEntry, Long> {
    List<LateEntry> findByStudentIdOrderByDateDesc(Long studentId);
    List<LateEntry> findByDateOrderByExpectedTimeAsc(LocalDate date);
    List<LateEntry> findByStudentHostelIdAndDate(Long hostelId, LocalDate date);
    Long countByDateAndStatus(LocalDate date, LateEntryStatus status);
}
