package com.hostel360.repository;

import com.hostel360.entity.FoodComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodComplaintRepository extends JpaRepository<FoodComplaint, Long> {
    List<FoodComplaint> findByHostelIdOrderByCreatedAtDesc(Long hostelId);
    List<FoodComplaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    Long countByStatus(String status);
}
