package web.stationery.service;

import web.stationery.dto.request.userrequest.ForgotPasswordRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.UserResponse;

public interface AuthService {
    UserResponse createUser(RegisterUserRequest userRequest);
    String forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
}
