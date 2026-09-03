package com.hostel360.entity;

import com.hostel360.entity.base.BaseEntity;
import com.hostel360.entity.enums.DayOfWeekEnum;
import com.hostel360.entity.enums.MealType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "food_menus", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"hostel_id", "day_of_week", "meal_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodMenu extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hostel_id", nullable = false)
    private Hostel hostel;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", length = 20, nullable = false)
    private DayOfWeekEnum dayOfWeek;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", length = 20, nullable = false)
    private MealType mealType;

    @Column(name = "menu_title", length = 150)
    private String menuTitle;

    @Column(name = "items", length = 1500, nullable = false)
    private String items; // Comma separated or json items description

    @Column(name = "special_diet_options", length = 500)
    private String specialDietOptions;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "is_published", nullable = false)
    @Builder.Default
    private Boolean isPublished = true;
}
