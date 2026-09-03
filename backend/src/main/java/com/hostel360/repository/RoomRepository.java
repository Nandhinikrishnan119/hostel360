package com.hostel360.repository;

import com.hostel360.entity.Room;
import com.hostel360.entity.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByBlockId(Long blockId);
    List<Room> findByBlockHostelId(Long hostelId);
    List<Room> findByStatus(RoomStatus status);
    Optional<Room> findByBlockIdAndRoomNumber(Long blockId, String roomNumber);

    @Query("SELECT r FROM Room r WHERE r.block.hostel.id = :hostelId AND r.currentOccupancy < r.capacity")
    List<Room> findAvailableRoomsInHostel(@Param("hostelId") Long hostelId);

    @Query("SELECT SUM(r.capacity) FROM Room r")
    Long getTotalCapacity();

    @Query("SELECT SUM(r.currentOccupancy) FROM Room r")
    Long getTotalOccupancy();
}
