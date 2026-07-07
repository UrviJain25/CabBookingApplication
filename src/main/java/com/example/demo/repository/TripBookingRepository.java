package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.TripBooking;

public interface TripBookingRepository extends JpaRepository<TripBooking, Long> {
}