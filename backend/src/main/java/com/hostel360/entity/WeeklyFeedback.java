package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "weekly_feedbacks", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "week_start_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyFeedback extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "food_score", nullable = false)
    private Integer foodScore; // 1-5

    @Column(name = "cleanliness_score", nullable = false)
    private Integer cleanlinessScore; // 1-5

    @Column(name = "wifi_score", nullable = false)
    private Integer wifiScore; // 1-5

    @Column(name = "water_score", nullable = false)
    private Integer waterScore; // 1-5

    @Column(name = "security_score", nullable = false)
    private Integer securityScore; // 1-5

    @Column(name = "maintenance_score", nullable = false)
    private Integer maintenanceScore; // 1-5

    @Column(name = "remarks", length = 1000)
    private String remarks;
}
