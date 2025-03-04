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

    @GetMapping("/categories/all")
    public CustomResponse<?> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(categoryService.findAll(size, page, sortBy));
    }

    @GetMapping("/categories/all-name")
    public CustomResponse<?> findAllByName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String name) {
        return new CustomResponse<>(categoryService.findAllByName(size, page, sortBy, name));
    }

    @GetMapping("/categories/{id}")
    public CustomResponse<?> findById(@PathVariable String id) {
        return new CustomResponse<>(categoryService.findById(Integer.valueOf(id)));
    }

    @GetMapping("/categories/tree")
    public CustomResponse<?> getCategoriesTree() {
        return new CustomResponse<>(categoryService.getCategoriesTree());
    }

    @GetMapping("/admin/categories/all-full")
    public CustomResponse<?> getAllCategoriesFull() {
        return new CustomResponse<>(categoryService.findAllFull());
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
