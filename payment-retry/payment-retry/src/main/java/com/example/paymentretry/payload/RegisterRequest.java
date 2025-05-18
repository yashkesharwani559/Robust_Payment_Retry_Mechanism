package com.example.paymentretry.payload;

import com.example.paymentretry.model.Role;

public class RegisterRequest {
    private String email;
    private String name;
    private String phone;
    private String password;
    private Role role;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String name, String phone, String password) {
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
