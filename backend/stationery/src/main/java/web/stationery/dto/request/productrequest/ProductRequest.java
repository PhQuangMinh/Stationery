package web.stationery.dto.request.productrequest;

import lombok.*;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProductRequest {
    private int id;
    private String name;
    private String description;
    private int price;
    private int quantity;
    private int countSales;
    private int discount;
    private String imageUrl;
    private BrandRequest brand;
    private List<CategoryRequest> categories;
}
