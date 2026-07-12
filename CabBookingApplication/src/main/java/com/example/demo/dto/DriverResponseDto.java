package com.example.demo.dto;

import lombok.Data;

@Data
public class DriverResponseDto {

    private Long driverId;
    private String driverName;
    private String licenceNo;
    private String mobileNumber;
    private String email;
    private float rating;

    // Flattened cab info (null if no cab assigned yet)
    private Long cabId;
    private String cabNumber;
}
