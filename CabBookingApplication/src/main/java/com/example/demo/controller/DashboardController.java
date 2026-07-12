package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.DashboardDto;
import com.example.demo.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8081")

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard APIs", description = "Admin Dashboard APIs")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Operation(summary = "View Dashboard Statistics")
    @GetMapping
    public ResponseEntity<DashboardDto> getDashboard() {

        return ResponseEntity.ok(
                dashboardService.getDashboardData());
    }
}