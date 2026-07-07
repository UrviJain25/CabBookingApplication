package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Cab;

public interface CabRepository extends JpaRepository<Cab, Long> {
    Optional<Cab> findByCabNumber(String cabNumber);

    // US-008: View Available Cabs
    List<Cab> findByAvailableTrue();
}
