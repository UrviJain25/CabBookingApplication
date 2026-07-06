package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.CabDto;
import com.example.demo.dto.CabResponseDto;
import com.example.demo.service.CabService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/cabs")
@Tag(name = "Cab APIs", description = "Cab Management APIs")
public class CabController {

    @Autowired
    private CabService cabService;

    @Operation(summary = "Add new cab")
    @PostMapping
    public ResponseEntity<CabResponseDto> addCab(@Valid @RequestBody CabDto dto) {

        CabResponseDto cab = cabService.addCab(dto);

        return new ResponseEntity<>(cab, HttpStatus.CREATED);
    }

    @Operation(summary = "Get all cabs")
    @GetMapping
    public ResponseEntity<List<CabResponseDto>> getAllCabs() {

        return ResponseEntity.ok(cabService.getAllCabs());
    }
}