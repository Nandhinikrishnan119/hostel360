package com.hostel360.repository;

import com.hostel360.entity.Escalation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EscalationRepository extends JpaRepository<Escalation, Long> {
    List<Escalation> findByComplaintIdOrderByEscalatedAtDesc(Long complaintId);
    void deleteByComplaintId(Long complaintId);
    List<Escalation> findByEscalationLevel(Integer escalationLevel);
    Long countByEscalationLevel(Integer escalationLevel);
}
