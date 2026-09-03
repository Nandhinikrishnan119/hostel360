package com.hostel360.repository;

import com.hostel360.entity.Suggestion;
import com.hostel360.entity.enums.SuggestionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    List<Suggestion> findAllByOrderByUpvotesCountDesc();
    List<Suggestion> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Suggestion> findByStatus(SuggestionStatus status);
    Long countByStatus(SuggestionStatus status);
}
