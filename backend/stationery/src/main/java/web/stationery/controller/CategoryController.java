package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.CategoryService;

@RequiredArgsConstructor
@RestController
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/categories/{id}")
    public CustomResponse<?> findById(@PathVariable String id) {
        return new CustomResponse<>(categoryService.findById(Integer.valueOf(id)));
    }

    @GetMapping("/admin/categories/tree")
    public CustomResponse<?> getCategoriesTree() {
        return new CustomResponse<>(categoryService.getCategoriesTree());
    }

    @GetMapping("/categories/tree")
    public CustomResponse<?> getPublicCategoriesTree() {
        return new CustomResponse<>(categoryService.getPublicCategoriesTree());
    }

    @PostMapping("/admin/categories")
    public CustomResponse<?> addCategory(@RequestBody AdminCategoryRequest categoryRequest) {
        return new CustomResponse<>(categoryService.saveAdmin(categoryRequest));
    }

    @PutMapping("/admin/categories/{id}")
    public CustomResponse<?> updateCategory(@PathVariable String id, @RequestBody AdminCategoryRequest categoryRequest) {
        return new CustomResponse<>(categoryService.updateAdmin(Integer.valueOf(id), categoryRequest));
    }

    @DeleteMapping("/admin/categories/{id}")
    public void deleteCategory(@PathVariable String id) {
        categoryService.deleteById(Integer.valueOf(id));
    }
}
