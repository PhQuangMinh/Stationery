package web.stationery.utils.mapper;

import org.springframework.stereotype.Component;
import web.stationery.common.constant.Role;
import web.stationery.dto.request.userrequest.RegisterUserAdminRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.Cart;
import web.stationery.model.User;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class UserMapper {
    
    public User toEntity(RegisterUserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        
        return user;
    }

    public User toEntityAdmin(RegisterUserAdminRequest request){
        User user = toEntity(request);
        user.setRole(Role.valueOf(request.getRole()));
        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);
        return user;
    }

    public UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setName(user.getName());
        response.setAddress(user.getAddress());
        response.setRole(String.valueOf(user.getRole()));
        
        return response;
    }

    public List<UserResponse> toUserResponseList(List<User> users) {
        if (users == null) {
            return Collections.emptyList();
        }
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public void updateUser(User user, UpdateUserRequest userRequest) {
        user.setEmail(userRequest.getEmail());
        user.setPhone(userRequest.getPhone());
        user.setName(user.getName());
        user.setAddress(userRequest.getAddress());
    }
}
