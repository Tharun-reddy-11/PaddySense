package com.paddysense.service;

import com.paddysense.dto.AuthRequest;
import com.paddysense.dto.AuthResponse;
import com.paddysense.dto.PasswordChangeRequest;
import com.paddysense.dto.RegisterRequest;
import com.paddysense.dto.UserProfileDto;
import com.paddysense.entity.User;
import com.paddysense.repository.UserRepository;
import com.paddysense.security.CustomUserDetailsService;
import com.paddysense.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       CustomUserDetailsService userDetailsService,
                       JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + req.getEmail());
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setState(req.getState());
        user.setDistrict(req.getDistrict());
        user.setVillage(req.getVillage());
        user.setPreferredUnit(req.getPreferredUnit() != null ? req.getPreferredUnit() : "hectare");
        user.setRole("ROLE_FARMER");

        User saved = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getRole(),
                saved.getPhone(),
                saved.getState(),
                saved.getDistrict(),
                saved.getVillage(),
                saved.getProfilePicture(),
                saved.getPreferredUnit()
        );
    }

    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail().toLowerCase().trim(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtils.generateToken(userDetails);

        return new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.getState(),
                user.getDistrict(),
                user.getVillage(),
                user.getProfilePicture(),
                user.getPreferredUnit()
        );
    }

    public UserProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setState(user.getState());
        dto.setDistrict(user.getDistrict());
        dto.setVillage(user.getVillage());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setPreferredUnit(user.getPreferredUnit());
        return dto;
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UserProfileDto dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getState() != null) user.setState(dto.getState());
        if (dto.getDistrict() != null) user.setDistrict(dto.getDistrict());
        if (dto.getVillage() != null) user.setVillage(dto.getVillage());
        if (dto.getProfilePicture() != null) user.setProfilePicture(dto.getProfilePicture());
        if (dto.getPreferredUnit() != null) user.setPreferredUnit(dto.getPreferredUnit());

        User updated = userRepository.save(user);
        return getProfile(updated.getEmail());
    }

    @Transactional
    public void changePassword(String email, PasswordChangeRequest req) {
        if (req.getNewPassword() == null || req.getNewPassword().trim().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long.");
        }
        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation password do not match.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }
}
