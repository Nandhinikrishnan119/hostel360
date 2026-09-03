package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.PriorityLevel;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintCategory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 60, unique = true, nullable = false)
    private String name;

    @Column(name = "code", length = 30, unique = true, nullable = false)
    private String code;

    @Column(name = "description", length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_priority", length = 20, nullable = false)
    @Builder.Default
    private PriorityLevel defaultPriority = PriorityLevel.MEDIUM;

    @Column(name = "sla_hours_low", nullable = false)
    @Builder.Default
    private Integer slaHoursLow = 72;

    @Column(name = "sla_hours_medium", nullable = false)
    @Builder.Default
    private Integer slaHoursMedium = 48;

    @Column(name = "sla_hours_high", nullable = false)
    @Builder.Default
    private Integer slaHoursHigh = 24;

    @Column(name = "sla_hours_critical", nullable = false)
    @Builder.Default
    private Integer slaHoursCritical = 4;
}
