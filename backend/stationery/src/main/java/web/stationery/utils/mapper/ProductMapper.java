package web.stationery.utils.mapper;

import org.springframework.stereotype.Component;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {
    
    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        // Set các trường khác từ request
        
        return product;
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setQuantity(product.getQuantity());

        if (product.getBrand() != null) {
            response.setBrandName(product.getBrand().getName());
        }

        return response;
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        if (products == null) {
            return Collections.emptyList();
        }
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void updateProduct(Product existingProduct, ProductRequest productRequest) {
        if (existingProduct != null && productRequest != null) {
            existingProduct.setName(productRequest.getName());
            existingProduct.setDescription(productRequest.getDescription());
            existingProduct.setPrice(productRequest.getPrice());
            existingProduct.setQuantity(productRequest.getQuantity());
            existingProduct.setImageUrl(productRequest.getImageUrl());
        }
    }
}
