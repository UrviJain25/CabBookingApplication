package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.service.LoginService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:8081", allowCredentials = "true")

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication APIs")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Operation(summary = "Login")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        return ResponseEntity.ok(
                loginService.login(
                        request.getUsername(),
                        request.getPassword(),
                        session));
    }

    @Operation(summary = "Logout")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {

        return ResponseEntity.ok(
                loginService.logout(session));

    }

}