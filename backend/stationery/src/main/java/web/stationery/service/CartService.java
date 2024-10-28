package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Cart;

public interface CartService {
    Page<Cart> findAll(int size, int page, String sortBy);
    Cart findById(String id);
    Cart save(Cart cart);
    void deleteById(String id);
}
