package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TripBooking;

public interface TripBookingRepository extends JpaRepository<TripBooking, Long> {

    List<TripBooking> findByCustomerId(int customerId);
    
    // US-018: Dashboard
    long countByStatusTrue();

}