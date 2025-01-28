package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;
import web.stationery.dto.response.CustomResponse;
import web.stationery.model.Category;
import web.stationery.service.CategoryService;

@RequiredArgsConstructor
@RestController
@RequestMapping("")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/admin/categories")
    public CategoryResponse createCategory(@RequestBody CategoryRequest category) {
        return categoryService.save(category);
    }

    @GetMapping("/categories")
    public CustomResponse<?> findByName(@RequestParam String name){
        return new CustomResponse<>(categoryService.findByName(name));
    }

    @GetMapping("/categories/all-name")
    public CustomResponse<?> findAllByName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String name
    ){
        return new CustomResponse<>(categoryService.findAllByName(size, page, sortBy, name));
    }

    @GetMapping("/categories/all")
    public CustomResponse<Page<CategoryResponse>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(categoryService.findAll(size, page, sortBy));
    }

    @PutMapping("/admin/categories")
    public CustomResponse<CategoryResponse> updateCategory(@RequestBody CategoryRequest category){
        return new CustomResponse<>(categoryService.save(category));
    }

    @DeleteMapping("/admin/categories")
    public CustomResponse<?> deleteCategory(@RequestParam String name){
        return new CustomResponse<>(categoryService.deleteByName(name));
    }

}
