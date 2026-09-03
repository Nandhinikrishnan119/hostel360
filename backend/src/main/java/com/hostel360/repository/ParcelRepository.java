package com.hostel360.repository;

import com.hostel360.entity.Parcel;
import com.hostel360.entity.enums.ParcelStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParcelRepository extends JpaRepository<Parcel, Long> {
    List<Parcel> findByStudentIdOrderByArrivalTimestampDesc(Long studentId);
    List<Parcel> findByStatusOrderByArrivalTimestampDesc(ParcelStatus status);
    Optional<Parcel> findByTrackingNumber(String trackingNumber);
    Long countByStatus(ParcelStatus status);
}
