package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.CartRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.CartResponse;
import web.stationery.model.Cart;
import web.stationery.model.User;

public interface CartService {
    Page<CartResponse> findAll(int size, int page, String sortBy);
    CartResponse findById(int id);
    CartResponse getCartUser(User user);
    CartResponse addProductToCart(User user, ProductRequest productRequest);
    CartResponse removeProductFromCart(User user, ProductRequest productRequest);
    CartResponse updateCart(User user, CartRequest cartRequest);
}
