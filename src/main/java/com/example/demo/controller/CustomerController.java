package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CustomerRegistrationDto;
import com.example.demo.dto.CustomerResponseDto;
import com.example.demo.service.CustomerService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/customers")
@Validated
@Tag(name = "Customer APIs", description = "Customer Management APIs")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Operation(summary = "Register a new customer")
    @PostMapping("/register")
    public ResponseEntity<CustomerResponseDto> registerCustomer(
            @Valid @RequestBody CustomerRegistrationDto dto) {

        CustomerResponseDto customer = customerService.registerCustomer(dto);

        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }

    @Operation(summary = "View customer profile by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDto> getCustomerById(@PathVariable Long id) {

        CustomerResponseDto customer = customerService.getCustomerById(id);

        return ResponseEntity.ok(customer);
    }
}