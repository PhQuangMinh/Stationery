package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.OrderResponse;
import web.stationery.service.OrderService;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/orders")
public class OderController {
    private final OrderService orderService;

    private final UserService userService;

    @GetMapping("/all")
    public CustomResponse<Page<OrderResponse>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(orderService.findAll(size, page, sortBy));
    }

    @GetMapping("/{username}/get-order")
    public CustomResponse<?> getOrderUser(@PathVariable String username){
        return new CustomResponse<>(orderService.getOrderUser(userService.findUserByUsername(username)));
    }

    @PutMapping("/delete-order/{id}")
    public CustomResponse<OrderResponse> deleteOrder(@PathVariable String id){
        return new CustomResponse<>(orderService.deleteById(id));
    }

    @PostMapping("/{username}")
    public CustomResponse<OrderResponse> createOrder(@PathVariable String username, @RequestBody OrderRequest orderRequest) {
        return new CustomResponse<>(orderService.save(userService.findUserByUsername(username), orderRequest));
    }

    @GetMapping("/{id}")
    public CustomResponse<OrderResponse> findById(@PathVariable int id){
        return new CustomResponse<>(orderService.findById(String.valueOf(id)));
    }

    @PutMapping("/update/{id}")
    public CustomResponse<OrderResponse> updateOrder(@PathVariable String username, @RequestBody OrderRequest orderRequest){
        return new CustomResponse<>(orderService.updateOrder(userService.findUserByUsername(username), orderRequest));
    }
}
