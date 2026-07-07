package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDto {

    @NotNull
    private Integer customerId;

    @NotNull
    private Long cabId;

    @NotBlank
    private String fromLocation;

    @NotBlank
    private String toLocation;
}