package com.hostel360.repository;

import com.hostel360.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, Long> {
    Optional<Hostel> findByCode(String code);
    Optional<Hostel> findByName(String name);
}
