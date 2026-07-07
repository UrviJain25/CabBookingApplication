package com.example.demo.service;

import com.example.demo.dto.BookingDto;
import com.example.demo.dto.TripBookingResponseDto;

public interface TripBookingService {

    // US-012: Book Cab
    TripBookingResponseDto bookCab(BookingDto dto);
}