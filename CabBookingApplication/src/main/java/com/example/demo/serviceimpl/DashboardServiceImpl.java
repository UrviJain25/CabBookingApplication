package com.example.demo.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardDto;
import com.example.demo.repository.CabRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.DriverRepository;
import com.example.demo.repository.TripBookingRepository;
import com.example.demo.service.DashboardService;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CabRepository cabRepository;

    @Autowired
    private TripBookingRepository tripBookingRepository;

    @Override
    public DashboardDto getDashboardData() {

        DashboardDto dto = new DashboardDto();

        dto.setTotalCustomers(customerRepository.count());
        dto.setTotalDrivers(driverRepository.count());
        dto.setTotalCabs(cabRepository.count());
        dto.setAvailableCabs(cabRepository.countByAvailableTrue());
        dto.setTotalBookings(tripBookingRepository.count());
        dto.setActiveBookings(tripBookingRepository.countByStatusTrue());

        return dto;
    }
}