package com.example.demo.serviceimpl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.CabDto;
import com.example.demo.dto.CabResponseDto;
import com.example.demo.entity.Cab;
import com.example.demo.repository.CabRepository;
import com.example.demo.service.CabService;

@Service
public class CabServiceImpl implements CabService {

    @Autowired
    private CabRepository cabRepository;

    @Override
    public CabResponseDto addCab(CabDto dto) {
        if (cabRepository.findByCabNumber(dto.getCabNumber()).isPresent()) {
            throw new RuntimeException("Cab number already exists");
        }
        Cab cab = new Cab();
        cab.setCabNumber(dto.getCabNumber());
        cab.setCarModel(dto.getCarModel());
        cab.setCabType(dto.getCabType());
        cab.setCapacity(dto.getCapacity());
        cab.setAvailable(dto.isAvailable());
        Cab savedCab = cabRepository.save(cab);
        return mapToResponseDto(savedCab);
    }

    @Override
    public List<CabResponseDto> getAllCabs() {
        List<CabResponseDto> response = new ArrayList<>();
        for (Cab cab : cabRepository.findAll()) {
            response.add(mapToResponseDto(cab));
        }
        return response;
    }

    @Override
    public CabResponseDto updateCab(Long cabId, CabDto dto) {
        Cab cab = cabRepository.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found with id: " + cabId));

        cab.setCabNumber(dto.getCabNumber());
        cab.setCarModel(dto.getCarModel());
        cab.setCabType(dto.getCabType());
        cab.setCapacity(dto.getCapacity());
        cab.setAvailable(dto.isAvailable());

        Cab updatedCab = cabRepository.save(cab);
        return mapToResponseDto(updatedCab);
    }

    @Override
    public void deleteCab(Long cabId) {
        Cab cab = cabRepository.findById(cabId)
                .orElseThrow(() -> new RuntimeException("Cab not found with id: " + cabId));
        cabRepository.delete(cab);
    }

    @Override
    public List<CabResponseDto> getAvailableCabs() {
        List<CabResponseDto> response = new ArrayList<>();
        for (Cab cab : cabRepository.findByAvailableTrue()) {
            response.add(mapToResponseDto(cab));
        }
        return response;
    }

    private CabResponseDto mapToResponseDto(Cab cab) {
        CabResponseDto dto = new CabResponseDto();
        dto.setCabId(cab.getCabId());
        dto.setCabNumber(cab.getCabNumber());
        dto.setCarModel(cab.getCarModel());
        dto.setCabType(cab.getCabType());
        dto.setCapacity(cab.getCapacity());
        dto.setAvailable(cab.isAvailable());
        return dto;
    }
}
