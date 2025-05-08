package web.stationery.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.common.exception.IncorrectDataException;
import web.stationery.dto.request.userrequest.AuthRequest;
import web.stationery.dto.request.userrequest.ForgotPasswordRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.AuthResponse;
import web.stationery.dto.response.CustomResponse;
import web.stationery.model.User;
import web.stationery.service.AuthService;
import web.stationery.service.JWTTokenService;
import web.stationery.service.RedisService;
import web.stationery.service.UserService;
import web.stationery.utils.BCryptEncoder;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@Validated
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public CustomResponse<?> register(@Valid @RequestBody RegisterUserRequest userRequest){
        return new CustomResponse<>(authService.createUser(userRequest), HttpStatus.OK);
    }

    @PostMapping("/login")
    public CustomResponse<?> login(@Valid @RequestBody AuthRequest authRequest){
        return new CustomResponse<>(authService.login(authRequest));
    }

    @PostMapping("/logout")
    public void logout(@RequestBody String accessToken) {
        authService.logout(accessToken);
    }

}
