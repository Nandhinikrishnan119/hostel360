package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.FoodIssueType;
import com.hostel360.entity.enums.MealType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "food_complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodComplaint extends BaseEntity {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "issue_type", length = 30, nullable = false)
    private FoodIssueType issueType;

    @Column(name = "description", length = 1000, nullable = false)
    private String description;

    @Column(name = "status", length = 30, nullable = false)
    @Builder.Default
    private String status = "REPORTED"; // REPORTED, INVESTIGATING, RESOLVED

    @Column(name = "manager_response", length = 500)
    private String managerResponse;
}
