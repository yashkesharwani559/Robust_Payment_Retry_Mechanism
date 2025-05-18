package com.example.paymentretry.service;

import com.example.paymentretry.exception.ResourceNotFoundException;
import com.example.paymentretry.exception.UnauthorisedAccess;
import com.example.paymentretry.exception.UserNotFoundException;
import com.example.paymentretry.model.Role;
import com.example.paymentretry.model.User;
import com.example.paymentretry.payload.CustomApiResponse;
import com.example.paymentretry.payload.PagedResponse;
import com.example.paymentretry.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserService {
    private final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /** Helper: fetch user by email or throw */
    private User requireUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + email));
    }

    /** Helper: require ADMIN role */
    private void requireAdmin(User u) {
        if (u.getRole() != Role.ADMIN) {
            throw new UnauthorisedAccess("Only ADMIN can perform this action.");
        }
    }

    /** GET /users/me */
    public ResponseEntity<CustomApiResponse<User>> getCurrentUser(String email) {
        try {
            User user = requireUserByEmail(email);
            System.out.println(user);
            return ResponseEntity.ok(CustomApiResponse.success(user, "Current user fetched", true));
        } catch (UserNotFoundException ex) {
            logger.error("getCurrentUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        }
    }

    /** PUT /users/me */
    @Transactional
    public ResponseEntity<CustomApiResponse<User>> updateCurrentUser(String email, User details) {
        try {
            User user = requireUserByEmail(email);
            if (details.getName() != null) user.setName(details.getName());
            if (details.getPhone() != null) user.setPhone(details.getPhone());
            if (details.getPassword() != null && !details.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(details.getPassword()));
            }
            User updated = userRepository.save(user);
            return ResponseEntity.ok(CustomApiResponse.success(updated, "Profile updated", true));
        } catch (UserNotFoundException ex) {
            logger.error("updateCurrentUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        } catch (Exception ex) {
            logger.error("updateCurrentUser error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Failed to update profile", false));
        }
    }

    /** GET /users */
    public ResponseEntity<CustomApiResponse<PagedResponse<User>>> getAllUsers(String email, int page, int size) {
        try {
            User admin = requireUserByEmail(email);
            requireAdmin(admin);

            Pageable pg = PageRequest.of(page, size);
            Page<User> users = userRepository.findAll(pg);

            PagedResponse<User> resp = new PagedResponse<>(
                    users.getContent(),
                    users.getNumber(),
                    users.getSize(),
                    users.getTotalElements(),
                    users.getTotalPages(),
                    users.isLast()
            );

            return ResponseEntity.ok(CustomApiResponse.success(resp, "Users fetched", true));
        } catch (UserNotFoundException ex) {
            logger.error("getAllUsers: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        } catch (UnauthorisedAccess ex) {
            logger.error("getAllUsers: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(CustomApiResponse.error(HttpStatus.FORBIDDEN, ex.getMessage(), false));
        } catch (Exception ex) {
            logger.error("getAllUsers error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Failed to fetch users", false));
        }
    }

    /** GET /users/{id} */
    public ResponseEntity<CustomApiResponse<User>> getUserById(String email, Long id) {
        try {
            User admin = requireUserByEmail(email);
            requireAdmin(admin);

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

            return ResponseEntity.ok(CustomApiResponse.success(user, "User fetched", true));
        } catch (UserNotFoundException ex) {
            logger.error("getUserById auth: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        } catch (ResourceNotFoundException ex) {
            logger.error("getUserById: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CustomApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), false));
        } catch (UnauthorisedAccess ex) {
            logger.error("getUserById: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(CustomApiResponse.error(HttpStatus.FORBIDDEN, ex.getMessage(), false));
        } catch (Exception ex) {
            logger.error("getUserById error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Failed to fetch user", false));
        }
    }

    /** PUT /users/{id} */
    @Transactional
    public ResponseEntity<CustomApiResponse<User>> updateUser(String email, Long id, User details) {
        try {
            User admin = requireUserByEmail(email);
            requireAdmin(admin);

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

            if (details.getName() != null) user.setName(details.getName());
            if (details.getPhone() != null) user.setPhone(details.getPhone());
            if (details.getPassword() != null && !details.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(details.getPassword()));
            }
            User updated = userRepository.save(user);

            return ResponseEntity.ok(CustomApiResponse.success(updated, "User updated", true));
        } catch (UserNotFoundException ex) {
            logger.error("updateUser auth: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        } catch (ResourceNotFoundException ex) {
            logger.error("updateUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CustomApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), false));
        } catch (UnauthorisedAccess ex) {
            logger.error("updateUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(CustomApiResponse.error(HttpStatus.FORBIDDEN, ex.getMessage(), false));
        } catch (Exception ex) {
            logger.error("updateUser error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Failed to update user", false));
        }
    }

    /** DELETE /users/{id} */
    @Transactional
    public ResponseEntity<CustomApiResponse<String>> deleteUser(String email, Long id) {
        try {
            User admin = requireUserByEmail(email);
            requireAdmin(admin);

            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
            userRepository.delete(user);

            return ResponseEntity.ok(CustomApiResponse.success(
                    "User deleted successfully", "User deleted", true));
        } catch (UserNotFoundException ex) {
            logger.error("deleteUser auth: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(CustomApiResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage(), false));
        } catch (ResourceNotFoundException ex) {
            logger.error("deleteUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(CustomApiResponse.error(HttpStatus.NOT_FOUND, ex.getMessage(), false));
        } catch (UnauthorisedAccess ex) {
            logger.error("deleteUser: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(CustomApiResponse.error(HttpStatus.FORBIDDEN, ex.getMessage(), false));
        } catch (Exception ex) {
            logger.error("deleteUser error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CustomApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR,
                            "Failed to delete user", false));
        }
    }
}
