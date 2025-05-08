package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import web.stationery.common.constant.Role;
import web.stationery.common.exception.AuthorizingException;
import web.stationery.common.exception.DataExistedException;
import web.stationery.common.exception.IncorrectDataException;
import web.stationery.dto.request.userrequest.AuthRequest;
import web.stationery.dto.request.userrequest.ForgotPasswordRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.AuthResponse;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;
import web.stationery.repository.UserRepository;
import web.stationery.service.*;
import web.stationery.utils.BCryptEncoder;
import web.stationery.utils.mapper.UserMapper;

import java.util.HashMap;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;

    private final UserRepository userRepository;

    private final EmailService emailService;

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final JWTTokenService jwtTokenService;

    private final RedisService redisService;

    @Override
    public AuthResponse createUser(RegisterUserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())
                || userRepository.existsByUsername(userRequest.getUsername())) {
            throw new DataExistedException("Existing user");
        }
        User user = userMapper.toEntity(userRequest);
        user.setPassword(BCryptEncoder.getPasswordEncoder().encode(userRequest.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setAddress(userRequest.getAddress());
        user.getCart().setUser(user);
        String accessToken = jwtTokenService.generateAccessToken(user, new HashMap<>());
        String refreshToken = jwtTokenService.generateRefreshToken(user, new HashMap<>());
        return new AuthResponse(accessToken, refreshToken, false);
    }

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (BadCredentialsException e) {
            throw new IncorrectDataException("Incorrect username or password");
        }
        final UserDetails userDetails = userService.loadUserByUserName(authRequest.getUsername());
        final String accessToken = jwtTokenService.generateAccessToken(userDetails, new HashMap<>());
        final String refreshToken = jwtTokenService.generateRefreshToken(userDetails, new HashMap<>());
        redisService.saveToken(userDetails.getUsername(), refreshToken);
        boolean isUserRole = userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_USER"));
        return new AuthResponse(
                accessToken
                , refreshToken
                , !isUserRole);
    }

    @Override
    public void logout(String accessToken) {
        String username = jwtTokenService.extractUsername(accessToken);
        redisService.deleteRefreshToken(username);
    }

    private boolean isValidRefreshToken(String refreshToken) {
        return !(refreshToken == null || refreshToken.isEmpty()
                || redisService.isValidRefreshToken(refreshToken, jwtTokenService.extractUsername(refreshToken))
                || jwtTokenService.isTokenExpired(refreshToken));
    }

    @Override
    public AuthResponse getAccessToken(String refreshToken) {
        if (!isValidRefreshToken(refreshToken)){
            throw new AuthorizingException("Invalid refresh token: " + refreshToken);
        }
        String username = jwtTokenService.extractUsername(refreshToken);
        User user = userService.findUserByUsername(username);
        final String accessToken = jwtTokenService.generateAccessToken(user, new HashMap<>());
        final String newRefreshToken = jwtTokenService.generateRefreshToken(user, new HashMap<>());
        redisService.saveToken(username, newRefreshToken);
        return new AuthResponse(
                accessToken
                , newRefreshToken
                , !user.getRole().name().equals(Role.ROLE_USER.name()));
    }


}
