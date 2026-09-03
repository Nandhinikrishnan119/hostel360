package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.HealthStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "health_records", indexes = {
    @Index(name = "idx_health_student", columnList = "student_id"),
    @Index(name = "idx_health_status", columnList = "status"),
    @Index(name = "idx_health_followup", columnList = "next_follow_up_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "symptoms", length = 1000, nullable = false)
    private String symptoms;

    @Column(name = "illness_type", length = 100, nullable = false)
    private String illnessType;

    @Column(name = "reported_date", nullable = false)
    private LocalDate reportedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private HealthStatus status = HealthStatus.CURRENTLY_UNWELL;

    @Column(name = "hospital_visit", nullable = false)
    @Builder.Default
    private Boolean hospitalVisit = false;

    @Column(name = "hospital_name", length = 150)
    private String hospitalName;

    @Column(name = "doctor_notes", length = 1000)
    private String doctorNotes;

    @Column(name = "expected_recovery_date")
    private LocalDate expectedRecoveryDate;

    @Column(name = "next_follow_up_date")
    private LocalDate nextFollowUpDate;
}
