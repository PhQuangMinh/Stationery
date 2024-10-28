package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Cart;
import web.stationery.repository.CartRepository;
import web.stationery.service.CartService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    @Override
    public Page<Cart> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return cartRepository.findAll(pageable);

    }

    @Override
    public Cart findById(String id) {
        Optional<Cart> cart = cartRepository.findById(id);
        if (cart.isEmpty()) throw new NotFoundException("Cart not found - " + id);
        return cart.get();
    }

    @Override
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public void deleteById(String id) {
        Optional<Cart> cart = cartRepository.findById(id);
        if (cart.isEmpty()) throw new NotFoundException("Cart not found - " + id);
        cartRepository.deleteById(id);
    }
}
