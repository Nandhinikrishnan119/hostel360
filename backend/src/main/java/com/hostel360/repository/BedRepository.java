package com.hostel360.repository;

import com.hostel360.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByRoomId(Long roomId);
    List<Bed> findByRoomIdAndIsOccupiedFalse(Long roomId);
    Optional<Bed> findByRoomIdAndBedLabel(Long roomId, String bedLabel);
    Long countByIsOccupiedFalse();
}
