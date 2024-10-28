package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.User;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/users")
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

    @GetMapping()
    public CustomResponse<Page<User>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(userService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<User> updateUser(@RequestBody User user){
        return new CustomResponse<>(userService.save(user));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id){
        userService.deleteById(id);
    }
}
