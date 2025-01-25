package web.stationery.utils.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;
import web.stationery.model.Category;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
    List<CategoryResponse> toResponseList(List<Category> categories);
    Category toEntity(CategoryRequest categoryRequest);
    void updateProduct(@MappingTarget Category category, CategoryRequest categoryRequest);
}
