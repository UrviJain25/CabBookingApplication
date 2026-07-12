package com.example.demo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DashboardDto {

    private long totalCustomers;
    private long totalDrivers;
    private long totalCabs;
    private long availableCabs;
    private long totalBookings;
    private long activeBookings;

}