package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Cart;
import web.stationery.service.CartService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/carts")
public class CartController {
    private final CartService cartService;

    @PostMapping()
    public Cart createcart(@RequestBody Cart cart) {
        return cartService.save(cart);
    }

    @GetMapping("/{id}")
    public CustomResponse<Cart> findById(@PathVariable int id){
        return new CustomResponse<>(cartService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Cart>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(cartService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Cart> updateCart(@RequestBody Cart cart){
        return new CustomResponse<>(cartService.save(cart));
    }

    @DeleteMapping("/{id}")
    public void deleteCart(@PathVariable String id){
        cartService.deleteById(id);
    }
}
