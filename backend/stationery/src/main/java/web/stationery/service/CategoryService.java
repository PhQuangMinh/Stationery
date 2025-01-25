package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;

public interface CategoryService {
    Page<CategoryResponse> findAll(int size, int page, String sortBy);
    CategoryResponse findByName(String name);
    CategoryResponse save(CategoryRequest category);
    CategoryResponse deleteByName(String name);
    Page<CategoryResponse> findAllByName(int size, int page, String sortBy, String name);
}
