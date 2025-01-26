package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
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
    public CustomResponse<?> addProduct(@RequestBody ProductRequest productRequest) {
        return new CustomResponse<>(productService.save(productRequest));
    }

    @PutMapping("/admin/products/{id}")
    public CustomResponse<?> updateProduct(@PathVariable int id, @RequestBody ProductRequest productRequest){
        return new CustomResponse<>(productService.update(String.valueOf(id), productRequest));
    }

    @DeleteMapping("/admin/products/{id}")
    public CustomResponse<?> deleteProduct(@PathVariable String id){
        return new CustomResponse<>(productService.deleteById(id));
    }
}
