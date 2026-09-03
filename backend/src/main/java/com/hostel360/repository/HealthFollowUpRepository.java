package com.hostel360.repository;

import com.hostel360.entity.HealthFollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthFollowUpRepository extends JpaRepository<HealthFollowUp, Long> {
    List<HealthFollowUp> findByHealthRecordIdOrderByFollowUpDateDesc(Long healthRecordId);
}
