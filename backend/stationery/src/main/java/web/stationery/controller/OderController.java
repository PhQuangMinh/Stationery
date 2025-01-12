package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.UserOrder;
import web.stationery.service.OrderService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/orders")
public class OderController {
    private final OrderService orderService;

    @PostMapping()
    public UserOrder createOrder(@RequestBody UserOrder order) {
        return orderService.save(order);
    }

    @GetMapping("/{id}")
    public CustomResponse<UserOrder> findById(@PathVariable int id){
        return new CustomResponse<>(orderService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<UserOrder>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(orderService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<UserOrder> updateOrder(@RequestBody UserOrder order){
        return new CustomResponse<>(orderService.save(order));
    }

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable String id){
        orderService.deleteById(id);
    }
}
