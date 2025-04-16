package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.CartItemRequest;
import web.stationery.dto.request.CartRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.CartResponse;
import web.stationery.dto.response.CustomResponse;
import web.stationery.model.Cart;
import web.stationery.model.CartItem;
import web.stationery.service.CartService;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
public class CartController {
    private final CartService cartService;

    private final UserService userService;

    @GetMapping("/admin/carts/all")
    public CustomResponse<?> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(cartService.findAll(size, page, sortBy));
    }

    @GetMapping("/user/{username}/carts/get-cart")
    public CustomResponse<?> getCartUser(@PathVariable String username){
        return new CustomResponse<>(cartService.getCartUser(userService.findUserByUsername(username)));
    }

    @PostMapping("/user/{username}/carts/add-products")
    public CustomResponse<?> addProductToCart(@PathVariable String username, @RequestBody ProductRequest productRequest) {
        return new CustomResponse<>(cartService.addProductToCart(userService.findUserByUsername(username), productRequest));
    }

    @PutMapping("/user/{username}/carts/update")
    public CustomResponse<?> updateCart(@PathVariable String username, @RequestBody CartRequest cart){
        return new CustomResponse<>(cartService.updateCart(userService.findUserByUsername(username), cart));
    }

    @DeleteMapping("/user/{username}/carts/remove-products")
    public CustomResponse<?> removeProductFromCart(@PathVariable String username, @RequestBody CartItemRequest cartItemRequest){
        return new CustomResponse<>(cartService.removeProductFromCart(userService.findUserByUsername(username), cartItemRequest));
    }
}
