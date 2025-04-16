package web.stationery.mapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Component;
import web.stationery.dto.response.productresponse.ProductResponse;
import web.stationery.dto.response.brandresponse.BrandResponse;
import web.stationery.dto.response.categoryresponse.CategoryResponse;
import web.stationery.model.elasticsearch.BrandDocument;
import web.stationery.model.elasticsearch.CategoryDocument;
import web.stationery.model.elasticsearch.ProductDocument;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductDocumentMapper {

    public ProductResponse toProductResponse(ProductDocument document) {
        if (document == null) {
            return null;
        }

        ProductResponse response = new ProductResponse();
        response.setId(document.getId());
        response.setName(document.getName());
        response.setDescription(document.getDescription());
        response.setPrice(document.getPrice());
        response.setQuantity(document.getQuantity());
        response.setCountSales(document.getCountSales());
        response.setDiscount(document.getDiscount());
        response.setImageUrl(document.getImageUrl());
        
        if (document.getBrand() != null) {
            response.setBrandResponse(toBrandResponse(document.getBrand()));
        }
        
        if (document.getCategories() != null) {
            response.setCategories(toCategoryResponses(document.getCategories()));
        }
        
        return response;
    }
    
    public Page<ProductResponse> toProductResponsePage(Page<ProductDocument> documentPage) {
        List<ProductResponse> responseList = documentPage.getContent()
                .stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
                
        return new PageImpl<>(
                responseList, 
                documentPage.getPageable(), 
                documentPage.getTotalElements()
        );
    }
    

    public List<ProductResponse> toProductResponseList(List<ProductDocument> documents) {
        return documents.stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }
    

    private BrandResponse toBrandResponse(BrandDocument brandDocument) {
        BrandResponse response = new BrandResponse();
        response.setId(brandDocument.getId());
        response.setName(brandDocument.getName());
        return response;
    }
    

    private List<CategoryResponse> toCategoryResponses(List<CategoryDocument> categoryDocuments) {
        return categoryDocuments.stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toList());
    }

    private CategoryResponse toCategoryResponse(CategoryDocument categoryDocument) {
        CategoryResponse response = new CategoryResponse();
        response.setId(categoryDocument.getId());
        response.setName(categoryDocument.getName());
        return response;
    }
} 