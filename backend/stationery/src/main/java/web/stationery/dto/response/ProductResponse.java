package web.stationery.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import web.stationery.model.Category;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private int id;
    private String name;
    private String description;
    private int price;
    private int quantity;
    private int countSales;
    private int discount;
    private String imageUrl;
    private String brandName;
    private boolean deleteFlag;
    private List<CategoryResponse> categories;
}
