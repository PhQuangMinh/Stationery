package web.stationery.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
    Product toEntity(ProductRequest productRequest);
    List<ProductResponse> toResponseList(List<Product> products);
    void updateProduct(@MappingTarget Product product, ProductRequest productRequest);

}
