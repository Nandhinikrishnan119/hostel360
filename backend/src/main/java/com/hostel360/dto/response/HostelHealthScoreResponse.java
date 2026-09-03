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
public class HostelHealthScoreResponse {
    private Long hostelId;
    private String hostelName;
    private Integer overallScore; // 0 - 100
    private String ratingGrade;   // EXCELLENT (90+), GOOD (75-89), AVERAGE (60-74), POOR (<60)

    private Integer resolutionScore;    // 0 - 30 max
    private Integer foodQualityScore;   // 0 - 25 max
    private Integer cleanlinessScore;   // 0 - 20 max
    private Integer infrastructureScore;// 0 - 15 max
    private Integer studentSatisfaction;// 0 - 10 max

    private List<HealthFactor> factorBreakdown;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HealthFactor {
        private String factorName;
        private Integer pointsEarned;
        private Integer maxPoints;
        private String statusDescription;
    }
}
