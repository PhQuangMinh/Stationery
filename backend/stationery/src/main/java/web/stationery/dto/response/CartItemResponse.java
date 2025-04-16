package web.stationery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartItemResponse {
    private String id;
    private String name;
    private int price;
    private String imageUrl;
    private int quantity;
    private int discount;
    private int productId;
}
