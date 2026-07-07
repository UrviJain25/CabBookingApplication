package com.example.demo.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.LoginService;

import jakarta.servlet.http.HttpSession;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String login(String username, String password, HttpSession session) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid Username"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        // Already logged in?
        if (session.getAttribute("username") != null) {
            throw new RuntimeException("User already logged in");
        }

        session.setAttribute("username", username);

        return "Login Successful";
    }

    @Override
    public String logout(HttpSession session) {

        if (session.getAttribute("username") == null) {
            throw new RuntimeException("No active session found");
        }

        session.invalidate();

        return "Logout Successful";
    }

}