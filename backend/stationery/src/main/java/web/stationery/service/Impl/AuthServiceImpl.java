package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.stationery.common.constant.Role;
import web.stationery.common.exception.DataExistedException;
import web.stationery.common.exception.IncorrectDataException;
import web.stationery.dto.request.userrequest.ForgotPasswordRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;
import web.stationery.repository.UserRepository;
import web.stationery.service.AuthService;
import web.stationery.service.EmailService;
import web.stationery.service.UserService;
import web.stationery.utils.BCryptEncoder;
import web.stationery.utils.mapper.UserMapper;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;

    private final UserRepository userRepository;

    private final EmailService emailService;

    @Override
    public UserResponse createUser(RegisterUserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())
                || userRepository.existsByUsername(userRequest.getUsername())) {
            throw new DataExistedException("Existing user");
        }
        User user = userMapper.toEntity(userRequest);
        user.setPassword(BCryptEncoder.getPasswordEncoder().encode(userRequest.getPassword()));
        user.setRole(Role.ROLE_USER);
        user.setAddress(userRequest.getAddress());
        user.getCart().setUser(user);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest forgotPasswordRequest) {
        return emailService.sendVerificationCode(forgotPasswordRequest.getEmail());
    }


}
