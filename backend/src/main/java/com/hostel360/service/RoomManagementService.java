package com.hostel360.service;

import com.hostel360.dto.response.RoomDetailResponse;
import com.hostel360.entity.*;
import com.hostel360.exception.ResourceNotFoundException;
import com.hostel360.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomManagementService {

    private final HostelRepository hostelRepository;
    private final BlockRepository blockRepository;
    private final RoomRepository roomRepository;
    private final BedRepository bedRepository;
    private final StudentRepository studentRepository;

    @Transactional(readOnly = true)
    public List<Hostel> getAllHostels() {
        return hostelRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Block> getBlocksByHostel(Long hostelId) {
        return blockRepository.findByHostelId(hostelId);
    }

    @Transactional(readOnly = true)
    public List<RoomDetailResponse> getRoomsByBlock(Long blockId) {
        List<Room> rooms = roomRepository.findByBlockId(blockId);
        return rooms.stream().map(this::mapToRoomDetail).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomDetailResponse> getRoomsByHostel(Long hostelId) {
        List<Room> rooms = roomRepository.findByBlockHostelId(hostelId);
        return rooms.stream().map(this::mapToRoomDetail).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomDetailResponse getRoomDetail(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", "id", roomId));
        return mapToRoomDetail(room);
    }

    private RoomDetailResponse mapToRoomDetail(Room room) {
        List<Student> students = studentRepository.findByRoomId(room.getId());
        List<RoomDetailResponse.OccupantInfo> occupants = students.stream()
                .map(s -> RoomDetailResponse.OccupantInfo.builder()
                        .studentId(s.getId())
                        .rollNumber(s.getStudentId())
                        .name(s.getUser().getFullName())
                        .department(s.getDepartment() != null ? s.getDepartment().getCode() : "-")
                        .year(s.getYearOfStudy())
                        .bedLabel(s.getBed() != null ? s.getBed().getBedLabel() : "-")
                        .phone(s.getUser().getPhone())
                        .build())
                .collect(Collectors.toList());

        return RoomDetailResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .blockId(room.getBlock().getId())
                .blockName(room.getBlock().getName())
                .hostelId(room.getBlock().getHostel().getId())
                .hostelName(room.getBlock().getHostel().getName())
                .floor(room.getFloor())
                .capacity(room.getCapacity())
                .currentOccupancy(room.getCurrentOccupancy())
                .availableBeds(Math.max(0, room.getCapacity() - room.getCurrentOccupancy()))
                .roomType(room.getRoomType())
                .status(room.getStatus())
                .occupants(occupants)
                .build();
    }
}
