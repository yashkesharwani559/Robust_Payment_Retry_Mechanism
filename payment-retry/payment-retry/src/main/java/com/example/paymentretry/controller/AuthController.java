package com.example.paymentretry.controller;

import com.example.paymentretry.payload.*;
import com.example.paymentretry.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<CustomApiResponse<AuthResponse>> register(@RequestBody RegisterRequest registerRequest) {
        return authService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<CustomApiResponse<AuthResponse>> login(@RequestBody AuthRequest authRequest) {
        return authService.authenticateUser(authRequest);
    }
}
