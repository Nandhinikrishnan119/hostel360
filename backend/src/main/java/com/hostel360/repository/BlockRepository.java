package com.hostel360.repository;

import com.hostel360.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
    List<Block> findByHostelId(Long hostelId);
    Optional<Block> findByHostelIdAndName(Long hostelId, String name);
}
