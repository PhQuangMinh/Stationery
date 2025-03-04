package web.stationery.utils.mapper;

import org.springframework.stereotype.Component;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.categoryresponse.CategoryAdminResponse;
import web.stationery.dto.response.categoryresponse.CategoryResponse;
import web.stationery.dto.response.categoryresponse.CategoryUserResponse;
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
        return category;
    }

    public CategoryUserResponse toResponse(Category category) {
        if (category == null) {
            return null;
        }

        CategoryUserResponse response = new CategoryUserResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setId(category.getId());

        if (category.getSubcategories() != null) {
            response.setChildren(category.getSubcategories().stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList()));
        }
        
        return response;
    }

    public CategoryAdminResponse toAdminResponse(Category category) {
        if (category == null) {
            return null;
        }

        CategoryAdminResponse response = new CategoryAdminResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setId(category.getId());
        response.setDeleteFlag(category.isDeleteFlag());

        if (category.getSubcategories() != null) {
            response.setChildren(category.getSubcategories().stream()
                    .map(this::toAdminResponse)
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

    public void updateCategory(Category category, AdminCategoryRequest adminCategoryRequest) {
        category.setName(adminCategoryRequest.getName());
        category.setDeleteFlag(adminCategoryRequest.isDeleteFlag());
    }
}
