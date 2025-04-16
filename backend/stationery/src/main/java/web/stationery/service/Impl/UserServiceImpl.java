package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import web.stationery.common.constant.Role;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.userrequest.RegisterUserAdminRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserAdminRequest;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.OrderItem;
import web.stationery.model.Product;
import web.stationery.model.User;
import web.stationery.model.UserOrder;
import web.stationery.repository.OrderRepository;
import web.stationery.repository.UserRepository;
import web.stationery.service.UserService;
import web.stationery.utils.BCryptEncoder;
import web.stationery.utils.mapper.UserMapper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    private final UserMapper userMapper;

    private final OrderRepository orderRepository;

    @Override
    public Page<UserResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<User> userResponsePage = userRepository.findAll(pageable);
        List<UserResponse> userResponseList = userMapper.toUserResponseList(userResponsePage.getContent());
        return new PageImpl<>(userResponseList, pageable, userResponsePage.getTotalElements());
    }

    @Override
    public User findById(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) throw new NotFoundException("User not found - " + id);
        return user.get();
    }

    @Override
    public User findUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) throw new NotFoundException("User not found - " + username);
        return user.get();
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteById(String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException("User not found - " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDetails loadUserByUserName(String userName) {
        Optional<User> user = userRepository.findByUsername(userName);
        if (user.isEmpty()) throw new NotFoundException("User not found - " + userName);
        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                String.valueOf(user.get().getId()),
                new ArrayList<>(Collections.singletonList(new SimpleGrantedAuthority(user.get().getRole().name()))));
    }

    @Override
    public UserDetailsService loadUserDetailsService() {
        return username -> {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isEmpty()){
                throw new NotFoundException("User not found - " + username);
            }
            return new org.springframework.security.core.userdetails.User(
                    user.get().getUsername(),
                    user.get().getPassword(),
                    new ArrayList<>(Collections.singletonList(new SimpleGrantedAuthority(user.get().getRole().name())))
            );
        };
    }

    @Override
    public UserResponse updateUser(String username, UpdateUserRequest userRequest) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            throw new NotFoundException("User not found - " + username);
        }
        userMapper.updateUser(user.get(), userRequest);
        userRepository.save(user.get());
        return userMapper.toUserResponse(user.get());
    }

    @Override
    public UserResponse getProfileUserByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            throw new NotFoundException("User not found - " + username);
        }
        return userMapper.toUserResponse(user.get());
    }

    @Override
    public int getTotalSpending(String username) {
        System.out.println(username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()){
            throw new NotFoundException("User not found - " + username);
        }
        List<UserOrder> orders = orderRepository.findOrdersByUser(user.get());

        int totalSpending = 0;
        for (UserOrder order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                totalSpending += item.getProduct().getPrice() * item.getQuantity();
            }
        }
        return totalSpending;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserResponse addUserAdmin(RegisterUserAdminRequest userRequest) {
        User user = userMapper.toEntityAdmin(userRequest);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUserAdmin(String id, UpdateUserAdminRequest userRequest) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new NotFoundException("User not found - " + id);
        }
        
        userMapper.updateUser(user.get(), userRequest);
        if (userRequest.getRole() != null) {
            user.get().setRole(Role.valueOf(userRequest.getRole()));
        }
        
        return userMapper.toUserResponse(userRepository.save(user.get()));
    }

}
