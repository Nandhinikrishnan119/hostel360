package com.hostel360.repository;

import com.hostel360.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByStudentId(String studentId);
    List<Student> findByHostelId(Long hostelId);
    List<Student> findByRoomId(Long roomId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.studentId) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(s.user.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:hostelId IS NULL OR s.hostel.id = :hostelId) AND " +
           "(:departmentId IS NULL OR s.department.id = :departmentId)")
    Page<Student> searchStudents(@Param("query") String query,
                                @Param("hostelId") Long hostelId,
                                @Param("departmentId") Long departmentId,
                                Pageable pageable);
}
