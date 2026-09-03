package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.GenderType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hostels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hostel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 100, unique = true, nullable = false)
    private String name;

    @Column(name = "code", length = 30, unique = true, nullable = false)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender_type", length = 20, nullable = false)
    @Builder.Default
    private GenderType genderType = GenderType.COED;

    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warden_id")
    private User warden;

    @Column(name = "description", length = 500)
    private String description;
}
