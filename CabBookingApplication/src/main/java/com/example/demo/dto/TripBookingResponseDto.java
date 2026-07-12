package com.example.demo.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TripBookingResponseDto {

    private Long tripBookingId;
    private int customerId;

    private Long cabId;
    private String cabNumber;

    private Long driverId;
    private String driverName;

    private String fromLocation;
    private String toLocation;
    private LocalDateTime fromDateTime;
    private LocalDateTime toDateTime;
    private boolean status;
    private float distanceInKm;
    private float bill;
}