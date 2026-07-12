package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.DriverDto;
import com.example.demo.dto.DriverResponseDto;

public interface DriverService {

    // US-009: Add Driver
    DriverResponseDto addDriver(DriverDto dto);

    // US-010: Update Driver
    DriverResponseDto updateDriver(Long driverId, DriverDto dto);

    // US-011: Assign Driver to a Cab
    DriverResponseDto assignDriverToCab(Long driverId, Long cabId);

    List<DriverResponseDto> getAllDrivers();
}
