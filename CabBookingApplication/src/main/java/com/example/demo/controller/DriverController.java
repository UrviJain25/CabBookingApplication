package com.example.demo.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DriverDto;
import com.example.demo.dto.DriverResponseDto;
import com.example.demo.service.DriverService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8081")
@RestController
@RequestMapping("/drivers")
@Tag(name = "Driver APIs", description = "Driver Management APIs")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Operation(summary = "Add new driver")
    @PostMapping
    public ResponseEntity<DriverResponseDto> addDriver(@Valid @RequestBody DriverDto dto) {
        DriverResponseDto driver = driverService.addDriver(dto);
        return new ResponseEntity<>(driver, HttpStatus.CREATED);
    }

    @Operation(summary = "Update driver details")
    @PutMapping("/{driverId}")
    public ResponseEntity<DriverResponseDto> updateDriver(
            @PathVariable Long driverId,
            @Valid @RequestBody DriverDto dto) {
        return ResponseEntity.ok(driverService.updateDriver(driverId, dto));
    }

    @Operation(summary = "Assign a driver to a cab")
    @PutMapping("/{driverId}/assign/{cabId}")
    public ResponseEntity<DriverResponseDto> assignDriverToCab(
            @PathVariable Long driverId,
            @PathVariable Long cabId) {
        return ResponseEntity.ok(driverService.assignDriverToCab(driverId, cabId));
    }

    @Operation(summary = "Get all drivers")
    @GetMapping
    public ResponseEntity<List<DriverResponseDto>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @Operation(summary = "Delete driver by ID")
    @DeleteMapping("/{driverId}")
    public ResponseEntity<String> deleteDriver(@PathVariable Long driverId) {
        driverService.deleteDriver(driverId);
        return ResponseEntity.ok("Driver deleted successfully");
    }
}
