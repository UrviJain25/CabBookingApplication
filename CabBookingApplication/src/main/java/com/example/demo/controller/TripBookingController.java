package com.example.demo.controller;



import java.util.List; 


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.BookingDto;
import com.example.demo.dto.TripBookingResponseDto;
import com.example.demo.service.TripBookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/bookings")
@Tag(name = "Booking APIs", description = "Booking Management APIs")
public class TripBookingController {

    @Autowired
    private TripBookingService tripBookingService;

    @Operation(summary = "Book a cab")
    @PostMapping
    public ResponseEntity<TripBookingResponseDto> bookCab(@Valid @RequestBody BookingDto dto) {
        TripBookingResponseDto booking = tripBookingService.bookCab(dto);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Cancel a booking")
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<TripBookingResponseDto> cancelBooking(@PathVariable Long bookingId) {

        TripBookingResponseDto booking = tripBookingService.cancelBooking(bookingId);

        return ResponseEntity.ok(booking);
    }
    
    @Operation(summary = "View Booking History")
    @GetMapping("/history/{customerId}")
    public ResponseEntity<List<TripBookingResponseDto>> getBookingHistory(
            @PathVariable int customerId) {

        return ResponseEntity.ok(
                tripBookingService.getBookingHistory(customerId));
    }
    
    @Operation(summary = "View Booking Status")
    @GetMapping("/status/{bookingId}")
    public ResponseEntity<TripBookingResponseDto> getBookingStatus(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                tripBookingService.getBookingStatus(bookingId));
    }
    
    @Operation(summary = "View all bookings (Admin)")
    @GetMapping("/all")
    public ResponseEntity<List<TripBookingResponseDto>> getAllBookings() {

        return ResponseEntity.ok(
                tripBookingService.getAllBookings());
    }
    
    
}