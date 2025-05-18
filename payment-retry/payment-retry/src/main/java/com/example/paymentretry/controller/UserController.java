package com.example.paymentretry.controller;

import com.example.paymentretry.model.User;
import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.PagedResponse;
import com.example.paymentretry.security.UserDetailsImpl;
import com.example.paymentretry.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<CustomApiResponse<User>> getCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        System.out.println("currentUser :"+ currentUser);
        return userService.getCurrentUser(currentUser.getUsername());
    }

    @PutMapping("/me")
    public ResponseEntity<CustomApiResponse<User>> updateCurrentUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @Valid @RequestBody User userDetails) {
        return userService.updateCurrentUser(currentUser.getUsername(), userDetails);
    }

    @GetMapping
    public ResponseEntity<CustomApiResponse<PagedResponse<User>>> getAllUsers(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return userService.getAllUsers(currentUser.getUsername(), page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomApiResponse<User>> getUserById(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        return userService.getUserById(currentUser.getUsername(), id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomApiResponse<User>> updateUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id,
            @Valid @RequestBody User userDetails) {
        return userService.updateUser(currentUser.getUsername(), id, userDetails);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CustomApiResponse<String>> deleteUser(
            @AuthenticationPrincipal UserDetailsImpl currentUser,
            @PathVariable Long id) {
        return userService.deleteUser(currentUser.getUsername(), id);
    }
}
