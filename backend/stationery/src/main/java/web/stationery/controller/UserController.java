package web.stationery.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.userrequest.UpdateUserRequest;
import web.stationery.dto.request.userrequest.UserDeleteRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.model.User;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @PostMapping()
    public User createuser(@RequestBody User user) {
        return userService.save(user);
    }

    @GetMapping("/{id}")
    public CustomResponse<User> findById(@PathVariable int id){
        return new CustomResponse<>(userService.findById(String.valueOf(id)));
    }

    @PutMapping("/update-profile")
    public CustomResponse<?> updateUser(@Valid @RequestBody UpdateUserRequest userRequest){
        return new CustomResponse<>(userService.updateUser("johndoe123", userRequest), HttpStatus.OK);
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof JwtAuthenticationToken jwtToken){
//            Jwt jwt = jwtToken.getToken();
//            return new CustomResponse<>(userService.updateUser(jwt.getSubject(), userRequest), HttpStatus.OK.toString());
//        }
//        throw new AuthorizingException("Unauthenticated");
    }

    @GetMapping("/profile-current-user")
    public CustomResponse<?> getProfileUser(){
        return new CustomResponse<>(userService.getProfileUserByUsername("johndoe123"), HttpStatus.OK);
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof JwtAuthenticationToken jwtToken){
//            Jwt jwt = jwtToken.getToken();
//            return new CustomResponse<>(userService.getProfileUserByUsername(jwt.getSubject()), HttpStatus.OK.toString());
//        }
//        throw new AuthorizingException("Unauthenticated");
    }

    @DeleteMapping("/delete-user")
    public CustomResponse<?> deleteUser(@RequestBody UserDeleteRequest userDeleteRequest){
        return new CustomResponse<>(userService.deleteUserByUsername(userDeleteRequest.getUsername()), HttpStatus.OK);
    }

    @GetMapping("/users")
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
