package web.stationery.utils.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.categoryresponse.CategoryResponse;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final BrandMapper brandMapper;
    
    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCountSales(request.getCountSales());
        product.setDiscount(request.getDiscount());
        product.setImageUrl(request.getImageUrl());
        
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
        response.setCountSales(product.getCountSales());
        response.setDiscount(product.getDiscount());
        response.setImageUrl(product.getImageUrl());
        response.setCategories(product.getCategories().stream()
            .map(category -> new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getParent() != null ? category.getParent().getId() : null
            ))
            .collect(Collectors.toList()));
        response.setDeleteFlag(product.isDeleteFlag());
        response.setBrandResponse(brandMapper.toResponse(product.getBrand()));
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
