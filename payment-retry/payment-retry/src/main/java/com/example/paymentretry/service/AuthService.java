package com.example.paymentretry.service;

import com.example.paymentretry.exception.BadCredentialException;
import com.example.paymentretry.exception.UserNotFoundException;
import com.example.paymentretry.model.Role;
import com.example.paymentretry.model.User;
import com.example.paymentretry.payload.AuthRequest;
import com.example.paymentretry.payload.AuthResponse;
import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.RegisterRequest;
import com.example.paymentretry.repository.UserRepository;
import com.example.paymentretry.security.JwtService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class AuthService {
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public ResponseEntity<CustomApiResponse<AuthResponse>> registerUser(RegisterRequest registerRequest) {
        try {
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new UserNotFoundException("User with the given email already exists.");
            }
            Role role = (registerRequest.getRole() != null) ? registerRequest.getRole() : Role.USER;
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());

            // Save the new user with default Role USER
            User newUser = new User(
                    null,
                    registerRequest.getName(),
                    registerRequest.getEmail(),
                    registerRequest.getPhone(),
                    encodedPassword,
                    role,
                    true,
                    null,
                    null

            );
            userRepository.save(newUser);

            // Generate JWT token
            String token = jwtService.generateToken(newUser.getEmail(), role.name());

            // Prepare AuthResponse including user details and token
            AuthResponse authResponse = new AuthResponse(token, newUser.getName(), newUser.getEmail(), newUser.getPhone(), role.name());

            return ResponseEntity.status(HttpStatus.OK).body(CustomApiResponse.success(authResponse, "Registration successful", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error occurred during registration.", false));
        }
    }

    /**
     * Authenticate an existing user by email and password, and return the JWT token with user details
     */
    public ResponseEntity<CustomApiResponse<AuthResponse>> authenticateUser(AuthRequest authRequest) {
        try {
            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new UserNotFoundException("Invalid username or password."));

            if (!passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
                throw new BadCredentialException("Invalid username or password.");
            }

            // Generate JWT token
            String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

            // Prepare AuthResponse including user details and token
            AuthResponse authResponse = new AuthResponse(token, user.getName(), user.getEmail(), user.getPhone(), user.getRole().name());

            return ResponseEntity.status(HttpStatus.OK).body(CustomApiResponse.success(authResponse, "Login successful", true));

        } catch (UserNotFoundException | BadCredentialException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, e.getMessage(), false));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error occurred during login.", false));
        }
    }
}
