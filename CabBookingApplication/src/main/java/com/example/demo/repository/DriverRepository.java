package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Driver;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByLicenceNo(String licenceNo);

    // Used by booking: find which driver is currently assigned to a given cab
    Optional<Driver> findByCab_CabId(Long cabId);
}