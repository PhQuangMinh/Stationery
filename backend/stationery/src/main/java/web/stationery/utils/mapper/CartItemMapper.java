package web.stationery.utils.mapper;

import org.mapstruct.Mapper;
import web.stationery.dto.response.CartItemResponse;
import web.stationery.model.CartItem;

public class CartItemMapper {
    public CartItemResponse toResponse(CartItem cartItem){
        CartItemResponse cartItemResponse = new CartItemResponse();
        cartItemResponse.setId(String.valueOf(cartItem.getId()));
        cartItemResponse.setQuantity(cartItem.getQuantity());
        cartItemResponse.setName(cartItem.getProduct().getName());
        cartItemResponse.setPrice(cartItem.getProduct().getPrice());
        cartItemResponse.setImageUrl(cartItem.getProduct().getImageUrl());
        return cartItemResponse;
    }

//    CartItemResponse toResponse(CartItem cartItem);
//    CartItem toEntity(CartItemResponse cartItemResponse);

}
