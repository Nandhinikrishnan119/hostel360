package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.HealthConditionAssessment;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "health_follow_ups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthFollowUp extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "health_record_id", nullable = false)
    private HealthRecord healthRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "warden_id", nullable = false)
    private User warden;

    @Column(name = "follow_up_date", nullable = false)
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "student_condition", length = 30, nullable = false)
    private HealthConditionAssessment studentCondition;

    @Column(name = "notes", length = 1000, nullable = false)
    private String notes;
}
