package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.stationery.common.constant.Role;
import web.stationery.common.exception.DataExistedException;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;
import web.stationery.repository.UserRepository;
import web.stationery.service.AuthService;
import web.stationery.utils.BCryptEncoder;
import web.stationery.utils.mapper.UserMapper;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserMapper userMapper;

    private final UserRepository userRepository;

    @Override
    public UserResponse createUser(RegisterUserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())
                || userRepository.existsByUsername(userRequest.getUsername())) {
            throw new DataExistedException("Existing user");
        }
        User user = userMapper.toEntity(userRequest);
        user.setPassword(BCryptEncoder.getPasswordEncoder().encode(userRequest.getPassword()));
        user.setRole(Role.ROLE_USER);
        System.out.println(user.getRole());
        user.setAddress(userRequest.getAddress());
        System.out.println(user);
        System.out.println(userRequest);
        user.getCart().setUser(user);
        return userMapper.toUserResponse(userRepository.save(user));
    }
}
