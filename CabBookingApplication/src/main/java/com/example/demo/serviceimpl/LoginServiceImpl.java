package com.example.demo.serviceimpl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.Customer;
import com.example.demo.entity.User;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.LoginService;

import jakarta.servlet.http.HttpSession;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(String username, String password, HttpSession session) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid Username"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        // If already logged in, we overwrite the session with the new user
        session.setAttribute("username", username);
        session.setAttribute("role", user.getRole());

        // Try to resolve customerId for CUSTOMER role
        Long customerId = null;
        if ("CUSTOMER".equalsIgnoreCase(user.getRole())) {
            Optional<Customer> customerOpt = customerRepository.findByUserUsername(username);
            if (customerOpt.isPresent()) {
                customerId = customerOpt.get().getCustomerId();
            }
        }

        return new LoginResponse(
                "Login Successful",
                user.getRole(),
                customerId,
                username
        );
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