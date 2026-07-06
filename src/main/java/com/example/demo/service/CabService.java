package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.CabDto;
import com.example.demo.dto.CabResponseDto;

public interface CabService {

    CabResponseDto addCab(CabDto dto);

    List<CabResponseDto> getAllCabs();

}