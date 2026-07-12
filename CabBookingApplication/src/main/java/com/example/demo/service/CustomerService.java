package com.example.demo.service;

import java.util.List;


import com.example.demo.dto.CustomerRegistrationDto;
import com.example.demo.dto.CustomerResponseDto;

public interface CustomerService {

    CustomerResponseDto registerCustomer(CustomerRegistrationDto dto);

    CustomerResponseDto getCustomerById(Long id);
    
    List<CustomerResponseDto> getAllCustomers();

    void deleteCustomer(Long id);

}