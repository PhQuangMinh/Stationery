package web.stationery.service;

import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.UserResponse;

public interface AuthService {
    public UserResponse createUser(RegisterUserRequest userRequest);
}
