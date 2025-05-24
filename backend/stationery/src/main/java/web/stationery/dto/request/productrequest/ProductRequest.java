package web.stationery.dto.request.productrequest;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
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
    private CategoryRequest category;

    public ProductRequest(int id, String name, String description, int price, int quantity, int countSales, int discount, String imageUrl, BrandRequest brand, CategoryRequest category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.countSales = countSales;
        this.discount = discount;
        this.imageUrl = imageUrl;
        this.brand = brand;
        this.category = category;
    }
}
