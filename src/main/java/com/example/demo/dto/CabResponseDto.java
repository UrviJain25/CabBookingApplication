package com.example.demo.dto;

import lombok.Data;

@Data
public class CabResponseDto {

    private Long cabId;

    private String cabNumber;

    private String carModel;

    private String cabType;

    private int capacity;

    private boolean available;

}