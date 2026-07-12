package com.example.demo.service;

import com.example.demo.dto.LoginResponse;

import jakarta.servlet.http.HttpSession;

public interface LoginService {

    LoginResponse login(String username, String password, HttpSession session);

    String logout(HttpSession session);
}