package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Product;
import web.stationery.service.ProductService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/products")
public class ProductController {
    private final ProductService productService;

    @PostMapping()
    public Product createproduct(@RequestBody Product product) {
        return productService.save(product);
    }

    @GetMapping("/{id}")
    public CustomResponse<Product> findById(@PathVariable int id){
        return new CustomResponse<>(productService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Product>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(productService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Product> updateProduct(@RequestBody Product product){
        return new CustomResponse<>(productService.save(product));
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id){
        productService.deleteById(id);
    }
}
