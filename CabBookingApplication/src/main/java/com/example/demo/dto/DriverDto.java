package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverDto {

    @NotBlank
    private String driverName;

    @NotBlank
    private String licenceNo;

    @NotBlank
    private String mobileNumber;

    @Email
    @NotBlank
    private String email;
}
