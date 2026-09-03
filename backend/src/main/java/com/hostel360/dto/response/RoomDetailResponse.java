package com.hostel360.dto.response;

import com.hostel360.entity.enums.RoomStatus;
import com.hostel360.entity.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDetailResponse {
    private Long id;
    private String roomNumber;
    private Long blockId;
    private String blockName;
    private Long hostelId;
    private String hostelName;
    private Integer floor;
    private Integer capacity;
    private Integer currentOccupancy;
    private Integer availableBeds;
    private RoomType roomType;
    private RoomStatus status;
    private List<OccupantInfo> occupants;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OccupantInfo {
        private Long studentId;
        private String rollNumber;
        private String name;
        private String department;
        private Integer year;
        private String bedLabel;
        private String phone;
    }
}
