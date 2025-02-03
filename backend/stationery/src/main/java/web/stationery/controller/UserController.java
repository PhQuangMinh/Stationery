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
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.request.userrequest.UserDeleteRequest;
import web.stationery.dto.response.CustomResponse;
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

    @GetMapping("/admin/{id}")
    public CustomResponse<User> findById(@PathVariable int id){
        return new CustomResponse<>(userService.findById(String.valueOf(id)));
    }

    @PutMapping("/users/update-profile")
    public CustomResponse<?> updateUser(@Valid @RequestBody UpdateUserRequest userRequest){
//        return new CustomResponse<>(userService.updateUser("johndoe123", userRequest), HttpStatus.OK);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtToken){
            Jwt jwt = jwtToken.getToken();
            return new CustomResponse<>(userService.updateUser(jwt.getSubject(), userRequest), HttpStatus.OK.toString());
        }
        throw new AuthorizingException("Unauthenticated");
    }

    @GetMapping("/users/profile-current-user")
    public CustomResponse<?> getProfileUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authentication type: " + authentication.getClass().getName());
        if (authentication instanceof JwtAuthenticationToken jwtToken){
            Jwt jwt = jwtToken.getToken();
            return new CustomResponse<>(userService.getProfileUserByUsername(jwt.getSubject()), HttpStatus.OK.toString());
        }
        throw new AuthorizingException("Unauthenticated");
    }

    @DeleteMapping("/admin/delete-user")
    public CustomResponse<?> deleteUser(@RequestBody UserDeleteRequest userDeleteRequest){
        return new CustomResponse<>(userService.deleteUserByUsername(userDeleteRequest.getUsername()), HttpStatus.OK);
    }

    @GetMapping("/admin/users")
    public CustomResponse<Page<User>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(userService.findAll(size, page, sortBy));
    }

    @GetMapping("/{username}/total-spending")
    public CustomResponse<Integer> getTotalSpending(@PathVariable String username){
        return new CustomResponse<>(userService.getTotalSpending(username), HttpStatus.OK);
    }

}
