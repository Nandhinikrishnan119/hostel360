package com.hostel360.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateIssueResponse {
    private Boolean isPotentialDuplicate;
    private Long rootComplaintId;
    private String rootComplaintTitle;
    private Integer affectedRoomsCount;
    private String blockName;
    private String categoryName;
    private String message;
    private List<String> affectedRoomNumbers;
}
