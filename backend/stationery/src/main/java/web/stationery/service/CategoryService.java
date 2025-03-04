package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.categoryresponse.CategoryAdminResponse;
import web.stationery.dto.response.categoryresponse.CategoryResponse;
import web.stationery.model.Category;

import java.util.List;

public interface CategoryService {
    Page<CategoryResponse> findAll(int size, int page, String sortBy);
    Page<CategoryResponse> findAllByName(int size, int page, String sortBy, String name);
    CategoryResponse findById(Integer id);
    List<CategoryAdminResponse> getCategoriesTree();
    List<CategoryResponse> findAllFull();

    Category findCategoryById(Integer id);
    Category saveAdmin(AdminCategoryRequest categoryRequest);
    Category updateAdmin(Integer id, AdminCategoryRequest categoryRequest);
    void deleteById(Integer id);
}
