package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.ParcelStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "parcels", indexes = {
    @Index(name = "idx_parcel_student", columnList = "student_id"),
    @Index(name = "idx_parcel_status", columnList = "status"),
    @Index(name = "idx_parcel_tracking", columnList = "tracking_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Parcel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "courier_name", length = 100, nullable = false)
    private String courierName;

    @Column(name = "tracking_number", length = 100)
    private String trackingNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "security_staff_id")
    private User securityStaff;

    @Column(name = "arrival_timestamp", nullable = false)
    private LocalDateTime arrivalTimestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private ParcelStatus status = ParcelStatus.ARRIVED;

    @Column(name = "collection_otp", length = 10)
    private String collectionOtp;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "remarks", length = 300)
    private String remarks;
}
