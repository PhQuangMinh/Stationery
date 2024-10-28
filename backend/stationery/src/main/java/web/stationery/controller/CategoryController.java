package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Category;
import web.stationery.service.CategoryService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/categorys")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping()
    public Category createCategory(@RequestBody Category category) {
        return categoryService.save(category);
    }

    @GetMapping("/{id}")
    public CustomResponse<Category> findById(@PathVariable int id){
        return new CustomResponse<>(categoryService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Category>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(categoryService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Category> updateCategory(@RequestBody Category category){
        return new CustomResponse<>(categoryService.save(category));
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable String id){
        categoryService.deleteById(id);
    }

}
