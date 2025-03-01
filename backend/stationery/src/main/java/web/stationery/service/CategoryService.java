package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;
import web.stationery.model.Category;

import java.util.List;

public interface CategoryService {
    // Các phương thức cho user thông thường
    Page<CategoryResponse> findAll(int size, int page, String sortBy);
    Page<CategoryResponse> findAllByName(int size, int page, String sortBy, String name);
    CategoryResponse findById(Integer id);
    List<CategoryResponse> getCategoriesTree();
    List<CategoryResponse> findAllFull();

    // Các phương thức cho admin
    Category findCategoryById(Integer id);
    CategoryResponse save(CategoryRequest categoryRequest);
    Category saveAdmin(AdminCategoryRequest categoryRequest);
    CategoryResponse update(Integer id, CategoryRequest categoryRequest);
    Category updateAdmin(Integer id, AdminCategoryRequest categoryRequest);
    CategoryResponse deleteById(Integer id);
}
