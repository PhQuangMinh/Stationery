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
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    // ... các endpoint khác giữ nguyên ...

    @DeleteMapping("/admin/orders/{id}")
    public void deleteOrder(@PathVariable String id) {
        orderService.deleteById(id);
    }

    // xóa endpoint cũ
    // @PutMapping("/admin/orders/delete-order/{id}")
} 