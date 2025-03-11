package web.stationery.service;

import web.stationery.dto.request.userrequest.AuthRequest;
import web.stationery.dto.request.userrequest.ForgotPasswordRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.AuthResponse;
import web.stationery.dto.response.UserResponse;

public interface AuthService {
    AuthResponse createUser(RegisterUserRequest userRequest);
    void forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    AuthResponse login(AuthRequest authRequest);
    void logout(String accessToken);
    AuthResponse getAccessToken(String refreshToken);
}
