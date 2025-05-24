package web.stationery.dto.request.productrequest;

import lombok.*;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminProductRequest extends ProductRequest {
    private boolean deleteFlag;

}