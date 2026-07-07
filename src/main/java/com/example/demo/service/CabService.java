package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.CabDto;
import com.example.demo.dto.CabResponseDto;

public interface CabService {
    CabResponseDto addCab(CabDto dto);

    List<CabResponseDto> getAllCabs();

    // US-006: Update Cab
    CabResponseDto updateCab(Long cabId, CabDto dto);

    // US-007: Delete Cab
    void deleteCab(Long cabId);

    // US-008: View Available Cabs
    List<CabResponseDto> getAvailableCabs();
}
