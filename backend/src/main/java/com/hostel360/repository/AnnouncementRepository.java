package com.hostel360.repository;

import com.hostel360.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.hostel IS NULL OR a.hostel.id = :hostelId) AND " +
           "(a.expiresAt IS NULL OR a.expiresAt > :now) " +
           "ORDER BY a.createdAt DESC")
    List<Announcement> findActiveForHostel(@Param("hostelId") Long hostelId, @Param("now") LocalDateTime now);

    @Query("SELECT a FROM Announcement a WHERE a.expiresAt IS NULL OR a.expiresAt > :now ORDER BY a.createdAt DESC")
    List<Announcement> findAllActive(@Param("now") LocalDateTime now);
}
