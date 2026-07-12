package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;



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

@CrossOrigin(origins = "http://localhost:8081")

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

    @Operation(summary = "Update cab details")
    @PutMapping("/{cabId}")
    public ResponseEntity<CabResponseDto> updateCab(
            @PathVariable Long cabId,
            @Valid @RequestBody CabDto dto) {
        return ResponseEntity.ok(cabService.updateCab(cabId, dto));
    }

    @Operation(summary = "Delete a cab")
    @DeleteMapping("/{cabId}")
    public ResponseEntity<Void> deleteCab(@PathVariable Long cabId) {
        cabService.deleteCab(cabId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "View available cabs")
    @GetMapping("/available")
    public ResponseEntity<List<CabResponseDto>> getAvailableCabs() {
        return ResponseEntity.ok(cabService.getAvailableCabs());
    }
}
