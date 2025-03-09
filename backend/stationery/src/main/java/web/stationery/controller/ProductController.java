package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.productrequest.AdminProductRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;
import web.stationery.service.ProductService;

@RequiredArgsConstructor
@RestController
public class ProductController {
    private final ProductService productService;

    @GetMapping("/products/all")
    public CustomResponse<?> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(productService.findAll(size, page, sortBy));
    }

    @GetMapping("/products/all-name")
    public CustomResponse<?> findAllByName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String name) {
        return new CustomResponse<>(productService.findAllByName(size, page, sortBy, name));
    }

    @GetMapping("/products/{id}")
    public CustomResponse<?> findById(@PathVariable String id){
        return new CustomResponse<>(productService.findById(id));
    }

    @PostMapping("/admin/products")
    public CustomResponse<?> addProduct(@RequestBody AdminProductRequest productRequest) {
        return new CustomResponse<>(productService.saveAdmin(productRequest));
    }

    @PutMapping("/admin/products")
    public CustomResponse<?> updateProduct(@RequestBody AdminProductRequest productRequest){
        return new CustomResponse<>(productService.updateAdmin(productRequest));
    }

    @DeleteMapping("/admin/products/{id}")
    public void deleteProduct(@PathVariable String id){
        productService.deleteById(id);
    }

    @GetMapping("/products/random/{categoryName}")
    public CustomResponse<?> getRandomProductsByCategory(@PathVariable String categoryName) {
        return new CustomResponse<>(productService.getRandomProductsByCategory(categoryName));
    }

    @GetMapping("/products/random-discount")
    public CustomResponse<?> getRandomDiscountProducts() {
        return new CustomResponse<>(productService.getRandomDiscountProducts());
    }

    @GetMapping("/products/category")
    public CustomResponse<?> findByCategoryName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String categoryName) {
        return new CustomResponse<>(productService.findByCategoryName(size, page, sortBy, categoryName));
    }
}
