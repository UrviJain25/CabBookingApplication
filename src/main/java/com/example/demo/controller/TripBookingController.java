package com.example.demo.controller;

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
}