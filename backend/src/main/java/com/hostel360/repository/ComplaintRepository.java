package com.hostel360.repository;

import com.hostel360.entity.Complaint;
import com.hostel360.entity.enums.ComplaintStatus;
import com.hostel360.entity.enums.PriorityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Complaint> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);

    List<Complaint> findByHostelIdOrderByCreatedAtDesc(Long hostelId);

    List<Complaint> findByStatus(ComplaintStatus status);

    Long countByStatus(ComplaintStatus status);

    Long countByPriority(PriorityLevel priority);

    Long countByHostelId(Long hostelId);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'STUDENT_CONFIRMED', 'CLOSED')")
    Long countOpenComplaints();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.priority = 'CRITICAL' AND c.status NOT IN ('RESOLVED', 'STUDENT_CONFIRMED', 'CLOSED')")
    Long countCriticalOpenComplaints();

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.slaDeadline < :now AND c.status NOT IN ('RESOLVED', 'STUDENT_CONFIRMED', 'CLOSED')")
    Long countOverdueComplaints(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Complaint c WHERE c.slaDeadline < :now AND c.status NOT IN ('RESOLVED', 'STUDENT_CONFIRMED', 'CLOSED')")
    List<Complaint> findOverdueComplaints(@Param("now") LocalDateTime now);

    @Query("SELECT c FROM Complaint c WHERE c.hostel.id = :hostelId AND c.block.id = :blockId " +
           "AND c.category.id = :categoryId AND c.createdAt >= :since AND c.id != :excludeId")
    List<Complaint> findRecentSimilarInBlock(@Param("hostelId") Long hostelId,
                                            @Param("blockId") Long blockId,
                                            @Param("categoryId") Long categoryId,
                                            @Param("since") LocalDateTime since,
                                            @Param("excludeId") Long excludeId);

    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.room.id = :roomId " +
           "AND c.category.id = :categoryId AND c.createdAt >= :since")
    Long countRecentRoomComplaintsByCategory(@Param("roomId") Long roomId,
                                            @Param("categoryId") Long categoryId,
                                            @Param("since") LocalDateTime since);

    @Query("SELECT c FROM Complaint c WHERE " +
           "(:hostelId IS NULL OR c.hostel.id = :hostelId) AND " +
           "(:blockId IS NULL OR c.block.id = :blockId) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:priority IS NULL OR c.priority = :priority) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(c.complaintNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Complaint> filterComplaints(@Param("hostelId") Long hostelId,
                                    @Param("blockId") Long blockId,
                                    @Param("status") ComplaintStatus status,
                                    @Param("priority") PriorityLevel priority,
                                    @Param("categoryId") Long categoryId,
                                    @Param("search") String search,
                                    Pageable pageable);
}
