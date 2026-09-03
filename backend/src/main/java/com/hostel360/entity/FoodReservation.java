package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.FoodReservationStatus;
import com.hostel360.entity.enums.MealType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "food_reservations", indexes = {
    @Index(name = "idx_resv_student", columnList = "student_id"),
    @Index(name = "idx_resv_date_meal", columnList = "meal_date, meal_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodReservation extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    @Column(name = "meal_date", nullable = false)
    private LocalDate mealDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", length = 20, nullable = false)
    private MealType mealType;

    @Column(name = "expected_arrival_time", nullable = false)
    private LocalTime expectedArrivalTime;

    @Column(name = "reason", length = 300, nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private FoodReservationStatus status = FoodReservationStatus.PENDING;

    @Column(name = "packing_notes", length = 300)
    private String packingNotes;
}
