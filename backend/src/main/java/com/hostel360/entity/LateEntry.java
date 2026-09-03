package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.LateEntryStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "late_entries", indexes = {
    @Index(name = "idx_late_student", columnList = "student_id"),
    @Index(name = "idx_late_date", columnList = "date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LateEntry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "expected_time", nullable = false)
    private LocalTime expectedTime;

    @Column(name = "reason", length = 500, nullable = false)
    private String reason;

    @Column(name = "actual_entry_time")
    private LocalDateTime actualEntryTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_security_id")
    private User recordedBySecurity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private LateEntryStatus status = LateEntryStatus.DECLARED;

    @Column(name = "remarks", length = 500)
    private String remarks;
}
