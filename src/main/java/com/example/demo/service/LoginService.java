package com.example.demo.service;

import jakarta.servlet.http.HttpSession;

public interface LoginService {

    String login(String username, String password, HttpSession session);

    String logout(HttpSession session);
}