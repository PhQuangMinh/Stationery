package web.stationery.service;

import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import web.stationery.dto.request.userrequest.RegisterUserAdminRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserAdminRequest;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;

public interface UserService {
    Page<UserResponse> findAll(int size, int page, String sortBy);
    User findById(String id);
    User findUserByUsername(String username);
    User save(User user);
    void deleteById(String id);
    UserDetails loadUserByUserName(String username);
    UserDetailsService loadUserDetailsService();
    UserResponse updateUser(String username, UpdateUserRequest updateUserRequest);
    UserResponse getProfileUserByUsername(String username);
    int getTotalSpending(String username);
    User findByEmail(String email);
    UserResponse addUserAdmin(RegisterUserAdminRequest userRequest);
    UserResponse updateUserAdmin(String id, UpdateUserAdminRequest userRequest);
}
