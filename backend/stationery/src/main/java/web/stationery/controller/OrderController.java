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
@RequestMapping("")
public class OrderController {
    private final OrderService orderService;

    private final UserService userService;


    @GetMapping("/admin/orders/all")
    public CustomResponse<Page<OrderResponse>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(orderService.findAll(size, page, sortBy));
    }

    @GetMapping("/user/orders/{username}/get-order")
    public CustomResponse<?> getOrderUser(@PathVariable String username){
        return new CustomResponse<>(orderService.getOrderUser(userService.findUserByUsername(username)));
    }

    @PutMapping("/admin/orders/delete-order/{id}")
    public void deleteOrder(@PathVariable String id){
        orderService.deleteById(id);
    }

    @PostMapping("/user/orders/{username}")
    public CustomResponse<OrderResponse> createOrder(@PathVariable String username, @RequestBody OrderRequest orderRequest) {
        return new CustomResponse<>(orderService.save(userService.findUserByUsername(username), orderRequest));
    }

    @GetMapping("/admin/orders/{id}")
    public CustomResponse<OrderResponse> findById(@PathVariable String id){
        return new CustomResponse<>(orderService.findById(id));
    }

    @PutMapping("/admin/orders/update/{id}")
    public CustomResponse<OrderResponse> updateOrderAdmin(@PathVariable String id, @RequestBody OrderRequest orderRequest){
        return new CustomResponse<>(orderService.updateOrderAdmin(id, orderRequest));
    }

    @PutMapping("/user/orders/cancel/{orderId}")
    public CustomResponse<?> cancelOrder(
            @PathVariable String orderId) {
        return new CustomResponse<>(orderService.cancelOrder(orderId));
    }

    @GetMapping("/user/orders/{username}/{orderId}")
    public CustomResponse<?> getUserOrderDetail(
            @PathVariable String username,
            @PathVariable String orderId) {
        return new CustomResponse<>(orderService.getOrderDetailByUser(username, orderId));
    }

}
