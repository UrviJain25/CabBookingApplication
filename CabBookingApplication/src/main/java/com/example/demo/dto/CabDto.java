package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CabDto {

    @NotBlank
    private String cabNumber;

    @NotBlank
    private String carModel;

    @NotBlank
    private String cabType;

    @Min(1)
    private int capacity;

    private boolean available;
}