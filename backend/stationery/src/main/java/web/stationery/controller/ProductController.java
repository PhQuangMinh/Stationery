package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.productrequest.AdminProductRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.productresponse.ProductResponse;
import web.stationery.service.Impl.elasticsearch.ProductESService;
import web.stationery.service.ProductService;

@RequiredArgsConstructor
@RestController
public class ProductController {
    private final ProductService productService;

    private final ProductESService productESService;

    @GetMapping("/products/all")
    public CustomResponse<?> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(productService.findAll(size, page, sortBy));
    }

    @GetMapping("/products/search")
    public CustomResponse<?> searchProducts(
            @RequestParam String name,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<ProductResponse> results = productESService.searchProductsByName(name, pageable);
        return new CustomResponse<>(results);
    }

//    @GetMapping("/products/search")
//    public CustomResponse<?> searchProducts(
//            @RequestParam String name,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "id") String sortBy
//    ) {
//        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
//        return productESService.searchProductsByName(name, pageable);
//
//    }

    @GetMapping("/products/search-jpa")
    public CustomResponse<?> searchProductsByNameJPA(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        return new CustomResponse<>(productService.searchByName(query, size, page, sortBy));
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
