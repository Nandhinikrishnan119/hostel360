package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.EscalationSource;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "escalations", indexes = {
    @Index(name = "idx_escalation_complaint", columnList = "complaint_id"),
    @Index(name = "idx_escalation_level", columnList = "escalation_level")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Escalation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Column(name = "escalation_level", nullable = false)
    private Integer escalationLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "previous_assignee_id")
    private User previousAssignee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "new_assignee_id")
    private User newAssignee;

    @Enumerated(EnumType.STRING)
    @Column(name = "escalation_source", length = 30, nullable = false)
    @Builder.Default
    private EscalationSource escalationSource = EscalationSource.SYSTEM_SLA;

    @Column(name = "reason", length = 500, nullable = false)
    private String reason;

    @Column(name = "escalated_at", nullable = false)
    private LocalDateTime escalatedAt;
}
