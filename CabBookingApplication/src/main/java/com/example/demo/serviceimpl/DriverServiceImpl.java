package com.example.demo.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DriverDto;
import com.example.demo.dto.DriverResponseDto;
import com.example.demo.entity.Cab;
import com.example.demo.entity.Driver;
import com.example.demo.repository.CabRepository;
import com.example.demo.repository.DriverRepository;
import com.example.demo.service.DriverService;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private CabRepository cabRepository;

    @Override
    public DriverResponseDto addDriver(DriverDto dto) {
        if (driverRepository.findByLicenceNo(dto.getLicenceNo()).isPresent()) {
            throw new RuntimeException("Driver with this licence number already exists");
        }

        Driver driver = new Driver();
        driver.setDriverName(dto.getDriverName());
        driver.setLicenceNo(dto.getLicenceNo());
        driver.setMobileNumber(dto.getMobileNumber());
        driver.setEmail(dto.getEmail());
        driver.setRating(0f);

        Driver savedDriver = driverRepository.save(driver);
        return mapToResponseDto(savedDriver);
    }

    @Override
    public DriverResponseDto updateDriver(Long driverId, DriverDto dto) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));

        driver.setDriverName(dto.getDriverName());
        driver.setLicenceNo(dto.getLicenceNo());
        driver.setMobileNumber(dto.getMobileNumber());
        driver.setEmail(dto.getEmail());

        Driver updatedDriver = driverRepository.save(driver);
        return mapToResponseDto(updatedDriver);
    }

    @Override
    public DriverResponseDto assignDriverToCab(Long driverId, Long cabId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));

        Cab cab = cabRepository.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found with id: " + cabId));

        if (!cab.isAvailable()) {
            throw new RuntimeException("Cab is not available for assignment");
        }

        driver.setCab(cab);
        Driver savedDriver = driverRepository.save(driver);
        return mapToResponseDto(savedDriver);
    }

    @Override
    public List<DriverResponseDto> getAllDrivers() {
        List<DriverResponseDto> response = new ArrayList<>();
        for (Driver driver : driverRepository.findAll()) {
            response.add(mapToResponseDto(driver));
        }
        return response;
    }

    @Override
    public void deleteDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + driverId));
        // Unlink from cab before deletion
        driver.setCab(null);
        driverRepository.save(driver);
        driverRepository.deleteById(driverId);
    }

    private DriverResponseDto mapToResponseDto(Driver driver) {
        DriverResponseDto dto = new DriverResponseDto();
        dto.setDriverId(driver.getDriverId());
        dto.setDriverName(driver.getDriverName());
        dto.setLicenceNo(driver.getLicenceNo());
        dto.setMobileNumber(driver.getMobileNumber());
        dto.setEmail(driver.getEmail());
        dto.setRating(driver.getRating());
        if (driver.getCab() != null) {
            dto.setCabId(driver.getCab().getCabId());
            dto.setCabNumber(driver.getCab().getCabNumber());
        }
        return dto;
    }
}
