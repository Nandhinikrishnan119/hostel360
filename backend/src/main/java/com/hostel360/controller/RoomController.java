package com.hostel360.controller;

import com.hostel360.dto.response.RoomDetailResponse;
import com.hostel360.entity.Block;
import com.hostel360.entity.Hostel;
import com.hostel360.service.RoomManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Hostel & Room Management", description = "Endpoints for hostel blocks, room allocations, and visual occupancy")
public class RoomController {

    private final RoomManagementService roomManagementService;

    @GetMapping("/hostels")
    @Operation(summary = "Get list of all hostels")
    public ResponseEntity<List<Hostel>> getAllHostels() {
        return ResponseEntity.ok(roomManagementService.getAllHostels());
    }

    @GetMapping("/hostels/{hostelId}/blocks")
    @Operation(summary = "Get blocks belonging to a hostel")
    public ResponseEntity<List<Block>> getBlocksByHostel(@PathVariable Long hostelId) {
        return ResponseEntity.ok(roomManagementService.getBlocksByHostel(hostelId));
    }

    @GetMapping("/blocks/{blockId}/rooms")
    @Operation(summary = "Get rooms and occupancy details for a specific block")
    public ResponseEntity<List<RoomDetailResponse>> getRoomsByBlock(@PathVariable Long blockId) {
        return ResponseEntity.ok(roomManagementService.getRoomsByBlock(blockId));
    }

    @GetMapping("/hostels/{hostelId}/rooms")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'WARDEN', 'SECURITY_STAFF')")
    @Operation(summary = "Get full room occupancy map for an entire hostel")
    public ResponseEntity<List<RoomDetailResponse>> getRoomsByHostel(@PathVariable Long hostelId) {
        return ResponseEntity.ok(roomManagementService.getRoomsByHostel(hostelId));
    }

    @GetMapping("/{roomId}")
    @Operation(summary = "Get single room occupancy detail with occupant names")
    public ResponseEntity<RoomDetailResponse> getRoomDetail(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomManagementService.getRoomDetail(roomId));
    }
}
