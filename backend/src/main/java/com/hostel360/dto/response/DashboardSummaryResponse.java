package com.hostel360.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private Long totalStudents;
    private Long totalHostels;
    private Long totalRooms;
    private Long occupiedRooms;
    private Long availableBeds;

    private Long openComplaints;
    private Long criticalComplaints;
    private Long overdueComplaints;
    private Long resolvedComplaints;

    private Long pendingLeaveRequests;
    private Long lateEntriesToday;

    private Long pendingFoodReservations;
    private Long openFoodComplaints;

    private Long activeHealthCases;
    private Long healthFollowUpsDue;

    private Long pendingSuggestions;
    private Long activeEmergencyReports;

    private Double averageFoodRating;
    private Double averageWeeklyRating;

    private Map<String, Long> complaintsByCategory;
    private Map<String, Long> complaintsByHostel;
}
