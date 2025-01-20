package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.CartRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.CartResponse;
import web.stationery.model.Cart;
import web.stationery.model.CartItem;
import web.stationery.model.Product;
import web.stationery.model.User;
import web.stationery.repository.CartRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.service.CartService;
import web.stationery.utils.mapper.CartItemMapper;
import web.stationery.utils.mapper.CartMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;

    private final ProductRepository productRepository;

    private final CartMapper cartMapper = new CartMapper();

    @Override
    public Page<CartResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Cart> cartsPage = cartRepository.findAll(pageable);
        List<CartResponse> cartResponseList = cartMapper.toResponseList(cartsPage.getContent());
        return new PageImpl<>(cartResponseList);
    }

    @Override
    public CartResponse findById(int id) {
        Optional<Cart> findCart = cartRepository.findById(String.valueOf(id));
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found - " + id);
        return cartMapper.toResponseCart(findCart.get());
    }

    @Override
    public CartResponse getCartUser(User user) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        return cartMapper.toResponseCart(findCart.get());
    }

    @Override
    public CartResponse addProductToCart(User user, ProductRequest productRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        Optional<Product> product = productRepository.findById(String.valueOf(productRequest.getId()));
        if (product.isEmpty()) throw new NotFoundException("Product not found for - " + productRequest.getId());
        CartItem cartItem = new CartItem();
        cartItem.setCart(findCart.get());
        cartItem.setProduct(product.get());
        cartItem.setQuantity(productRequest.getQuantity());
        findCart.get().getCartItems().add(cartItem);
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }

    @Override
    public CartResponse removeProductFromCart(User user, ProductRequest productRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        Optional<Product> product = productRepository.findById(String.valueOf(productRequest.getId()));
        if (product.isEmpty()) throw new NotFoundException("Product not found for - " + productRequest.getId());
        CartItem findCartItem = findCart.get().getCartItems()
                .stream()
                .filter(cartItem -> cartItem.getProduct().getId() == product.get().getId())
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Product not found in cart for - " + productRequest.getId()));
        findCartItem.setDeleteFlag(true);
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }

    @Override
    public CartResponse updateCart(User user, CartRequest cartRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        for (CartItem item:findCart.get().getCartItems()){
            cartRequest.getCartItems().stream().filter(cartItem -> cartItem.getId() == item.getId())
                    .findFirst().ifPresent(findCartItem -> item.setQuantity(findCartItem.getQuantity()));
        }
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }
}
