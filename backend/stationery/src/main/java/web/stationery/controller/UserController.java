package web.stationery.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.exception.AuthorizingException;
import web.stationery.dto.request.userrequest.RegisterUserAdminRequest;
import web.stationery.dto.request.userrequest.RegisterUserRequest;
import web.stationery.dto.request.userrequest.UpdateUserAdminRequest;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.request.userrequest.UserDeleteRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.User;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping()
    public User createuser(@RequestBody User user) {
        return userService.save(user);
    }

    @PutMapping("/users/update-profile/{username}")
    public CustomResponse<?> updateUser(@Valid @RequestBody UpdateUserRequest userRequest, String username){
        return new CustomResponse<>(userService.updateUser(username, userRequest), HttpStatus.OK.toString());
    }

    @GetMapping("/users/profile-current-user/{username}")
    public CustomResponse<?> getProfileUser(String username){
        return new CustomResponse<>(userService.getProfileUserByUsername(username), HttpStatus.OK.toString());
    }

    @DeleteMapping("/admin/users/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteById(id);
    }

    @GetMapping("/admin/users")
    public CustomResponse<Page<UserResponse>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(userService.findAll(size, page, sortBy));
    }

    @PostMapping("/admin/add-user-admin")
    public CustomResponse<UserResponse> addUserAdmin(@RequestBody RegisterUserAdminRequest userRequest){
        return new CustomResponse<>(userService.addUserAdmin(userRequest));
    }

    @GetMapping("/{username}/total-spending")
    public CustomResponse<Integer> getTotalSpending(@PathVariable String username){
        return new CustomResponse<>(userService.getTotalSpending(username), HttpStatus.OK);
    }

    @PutMapping("/admin/users/update/{id}")
    public CustomResponse<?> updateUserAdmin(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserAdminRequest userRequest) {
        return new CustomResponse<>(
            userService.updateUserAdmin(id, userRequest),
            HttpStatus.OK.toString()
        );
    }

    @GetMapping("/admin/{id}")
    public CustomResponse<User> findById(@PathVariable int id){
        return new CustomResponse<>(userService.findById(String.valueOf(id)));
    }

}
