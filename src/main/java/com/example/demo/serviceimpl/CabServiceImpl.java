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

        CabResponseDto response = new CabResponseDto();

        response.setCabId(savedCab.getCabId());
        response.setCabNumber(savedCab.getCabNumber());
        response.setCarModel(savedCab.getCarModel());
        response.setCabType(savedCab.getCabType());
        response.setCapacity(savedCab.getCapacity());
        response.setAvailable(savedCab.isAvailable());

        return response;
    }

    @Override
    public List<CabResponseDto> getAllCabs() {

        List<CabResponseDto> response = new ArrayList<>();

        for (Cab cab : cabRepository.findAll()) {

            CabResponseDto dto = new CabResponseDto();

            dto.setCabId(cab.getCabId());
            dto.setCabNumber(cab.getCabNumber());
            dto.setCarModel(cab.getCarModel());
            dto.setCabType(cab.getCabType());
            dto.setCapacity(cab.getCapacity());
            dto.setAvailable(cab.isAvailable());

            response.add(dto);
        }

        return response;
    }
}