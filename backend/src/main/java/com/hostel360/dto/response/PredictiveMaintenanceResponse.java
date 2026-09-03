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
public class PredictiveMaintenanceResponse {

    private List<RecurringIssueAlert> recurringIssues;
    private List<BlockTrendAlert> blockFailureTrends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecurringIssueAlert {
        private Long roomId;
        private String roomNumber;
        private String blockName;
        private String hostelName;
        private String categoryName;
        private Long complaintCount;
        private String recommendation;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BlockTrendAlert {
        private String blockName;
        private String hostelName;
        private String categoryName;
        private Double percentageIncrease;
        private String riskLevel; // LOW, MEDIUM, HIGH
        private String insightMessage;
    }
}
