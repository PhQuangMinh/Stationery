package web.stationery.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.common.exception.IncorrectDataException;
import web.stationery.dto.request.userrequest.AuthRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.AuthService;
import web.stationery.service.JWTTokenService;
import web.stationery.service.UserService;
import web.stationery.utils.BCryptEncoder;

@RequiredArgsConstructor
@RestController
@Validated
public class AuthController {
    private final AuthService authService;

    private final AuthenticationManager authenticationManager;

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;

    private final JWTTokenService jwtTokenService;

    @PostMapping("/register")
    public CustomResponse<?> register(@Valid @RequestBody RegisterUserRequest userRequest){
        System.out.println("ở đây " + authenticationManager);
        System.out.println(userRequest);
        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        return new CustomResponse<>(authService.createUser(userRequest), HttpStatus.OK);
    }

    @PostMapping("/login")
    public CustomResponse<?> login(@Valid @RequestBody AuthRequest authRequest){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new IncorrectDataException("Incorrect username or password");
        }
        final UserDetails userDetails = userService.loadUserByUserName(authRequest.getUsername());
        final String jwt = jwtTokenService.generateToken(userDetails);
        return new CustomResponse<>(jwt, HttpStatus.OK);
    }

}
