package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.BookingDto;
import com.example.demo.dto.TripBookingResponseDto;

public interface TripBookingService {

    // US-012
    TripBookingResponseDto bookCab(BookingDto dto);

    // US-013
    TripBookingResponseDto cancelBooking(Long bookingId);

    // US-014
    List<TripBookingResponseDto> getBookingHistory(int customerId);

    // US-015
    TripBookingResponseDto getBookingStatus(Long bookingId);

    // US-017
    List<TripBookingResponseDto> getAllBookings();

}