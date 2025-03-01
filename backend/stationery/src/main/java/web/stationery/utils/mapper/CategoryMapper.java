package web.stationery.utils.mapper;

import org.springframework.stereotype.Component;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;
import web.stationery.model.Category;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CategoryMapper {
    
    public Category toEntity(CategoryRequest request) {
        if (request == null) {
            return null;
        }

        Category category = new Category();
        category.setName(request.getName());
        // Các trường khác sẽ được set tự động hoặc trong service
        return category;
    }

    public CategoryResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }

        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setId(category.getId());
        
        // Map subcategories nếu có
        if (category.getSubcategories() != null) {
            response.setChildren(category.getSubcategories().stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList()));
        }
        
        return response;
    }

    public List<CategoryResponse> toResponseList(List<Category> categories) {
        if (categories == null) {
            return Collections.emptyList();
        }
        return categories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void updateCategory(Category category, CategoryRequest categoryRequest) {
        // Implementation of updateCategory method
    }

    public void updateCategory(Category category, AdminCategoryRequest adminCategoryRequest) {
        // Implementation of updateCategory method
    }
}
