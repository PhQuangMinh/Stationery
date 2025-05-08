package web.stationery.utils.mapper;

import web.stationery.dto.response.CartResponse;
import web.stationery.model.Cart;
import web.stationery.model.CartItem;

import java.util.ArrayList;
import java.util.List;

public class CartMapper {
    private final CartItemMapper cartItemMapper = new CartItemMapper();

    public List<CartResponse> toResponseList(List<Cart> carts) {
        List<CartResponse> cartResponseList = new ArrayList<>();
        for (Cart cart:carts){
            cartResponseList.add(toResponseCart(cart));
        }
        return cartResponseList;
    }

    public CartResponse toResponseCart(Cart cart){
        CartResponse cartResponse = new CartResponse();
        cartResponse.setId(cart.getId());
        for (CartItem cartItem:cart.getCartItems()){
            if (cartItem.getQuantity()>0){
                cartResponse.getCartItems().add(cartItemMapper.toResponse(cartItem));
            }
        }
        return cartResponse;
    }
}
