package com.example.demo.dto;

import lombok.Data;

@Data
public class CustomerResponseDto {

    private Long customerId;

    private String name;

    private String email;

    private String phone;

    private String address;

    private String username;

    private String role;

}