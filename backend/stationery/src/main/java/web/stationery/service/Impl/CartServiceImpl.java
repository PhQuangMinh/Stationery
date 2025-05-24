package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.CartItemRequest;
import web.stationery.dto.request.CartRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.CartResponse;
import web.stationery.model.Cart;
import web.stationery.model.CartItem;
import web.stationery.model.Product;
import web.stationery.model.User;
import web.stationery.repository.CartItemRepository;
import web.stationery.repository.CartRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.repository.UserRepository;
import web.stationery.service.CartService;
import web.stationery.utils.mapper.CartMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;

    private final ProductRepository productRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final CartMapper cartMapper = new CartMapper();

    @Override
    public Page<CartResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Cart> cartsPage = cartRepository.findAll(pageable);
        List<CartResponse> cartResponseList = cartMapper.toResponseList(cartsPage.getContent());
        return new PageImpl<>(cartResponseList, pageable, cartsPage.getTotalElements());
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
    public CartResponse addProductToCart(User user, CartItemRequest cartItemRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        
        Optional<Product> product = productRepository.findById(String.valueOf(cartItemRequest.getProductId()));
        if (product.isEmpty()) throw new NotFoundException("Product not found for - " + cartItemRequest.getProductId());

        if (product.get().getQuantity() < cartItemRequest.getQuantity()) {
            throw new IllegalArgumentException("Not enough quantity for product ID: " + cartItemRequest.getProductId());
        }

        if (cartItemRequest.getQuantity()<=0){
            throw  new IllegalArgumentException("Quantity not valid - " + cartItemRequest.getProductId());
        }
        
        Optional<CartItem> existingCartItem = findCart.get().getCartItems().stream()
                .filter(item -> item.getProduct().getId() == product.get().getId())
                .findFirst();
        
        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            int newQuantity = cartItem.getQuantity() + cartItemRequest.getQuantity();
            
            if (product.get().getQuantity() < newQuantity) {
                throw new IllegalArgumentException("Not enough quantity for product ID: " + cartItemRequest.getProductId());
            }
            
            cartItem.setQuantity(newQuantity);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setCart(findCart.get());
            cartItem.setProduct(product.get());
            cartItem.setQuantity(cartItemRequest.getQuantity());
            findCart.get().getCartItems().add(cartItem);
        }
        
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }

    @Override
    @Transactional
    public CartResponse removeProductFromCart(User user, CartItemRequest cartItemRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        Optional<CartItem> findExistCartItem = cartItemRepository.findById(cartItemRequest.getId());
        if (findExistCartItem.isEmpty()) throw new NotFoundException("Product not found for - " + cartItemRequest.getId());
        CartItem findCartItem = findCart.get().getCartItems()
                .stream()
                .filter(cartItem -> cartItem.getId() == findExistCartItem.get().getId())
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Cart Item not found in cart for - " + cartItemRequest.getId()));

        if (!cartItemRepository.existsById(findCartItem.getId())) {
            throw new RuntimeException("CartItem không tồn tại");
        }

        Product product = findCartItem.getProduct();
        product.setQuantity(product.getQuantity() + findCartItem.getQuantity());
        productRepository.save(product);

        findCart.get().getCartItems().remove(findCartItem);
        cartItemRepository.deleteById(findCartItem.getId());
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }

    @Override
    public CartResponse updateCart(User user, CartRequest cartRequest) {
        Optional<Cart> findCart = cartRepository.findByUser(user);
        if (findCart.isEmpty()) throw new NotFoundException("Cart not found for user - " + user.getUsername());
        
        for (CartItem item : findCart.get().getCartItems()) {
            cartRequest.getCartItems().stream()
                    .filter(cartItem -> cartItem.getId() == item.getId())
                    .findFirst()
                    .ifPresent(findCartItem -> {
                        if (findCartItem.getQuantity() <= 0) {
                            throw new IllegalArgumentException("Số lượng không hợp lệ cho sản phẩm ID: " + item.getProduct().getId());
                        }
                        if (item.getProduct().getQuantity() < findCartItem.getQuantity()) {
                            throw new IllegalArgumentException("Không đủ số lượng cho sản phẩm ID: " + item.getProduct().getId());
                        }
                        item.setQuantity(findCartItem.getQuantity());

                        Product product = item.getProduct();
                        product.setQuantity(product.getQuantity() - (findCartItem.getQuantity() - item.getQuantity()));
                        productRepository.save(product);
                    });
        }
        
        return cartMapper.toResponseCart(cartRepository.save(findCart.get()));
    }

    @Override
    public CartResponse clearCart(User user) {
        for (CartItem cartItem : user.getCart().getCartItems()) {
            Product product = cartItem.getProduct();
            product.setQuantity(product.getQuantity() + cartItem.getQuantity());
            productRepository.save(product);
        }
        
        user.getCart().getCartItems().clear();
        userRepository.save(user);
        return cartMapper.toResponseCart(user.getCart());
    }
}
