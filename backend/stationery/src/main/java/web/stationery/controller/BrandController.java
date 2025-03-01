package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.brandrequest.AdminBrandRequest;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.BrandService;

@RequiredArgsConstructor
@RestController
public class BrandController {
    private final BrandService brandService;

    @GetMapping("/brands/all")
    public CustomResponse<?> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(brandService.findAll(size, page, sortBy));
    }

    @GetMapping("/brands/all-name")
    public CustomResponse<?> findAllByName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String name) {
        return new CustomResponse<>(brandService.findAllByName(size, page, sortBy, name));
    }

    @GetMapping("/brands/{id}")
    public CustomResponse<?> findById(@PathVariable String id) {
        return new CustomResponse<>(brandService.findById(id));
    }

    @GetMapping("/brands/name")
    public CustomResponse<?> findByName(@RequestParam String name) {
        return new CustomResponse<>(brandService.findByName(name));
    }

    @GetMapping("/admin/brands/all-full")
    public CustomResponse<?> getAllBrandsFull() {
        return new CustomResponse<>(brandService.findAllFull());
    }

    @PostMapping("/admin/brands")
    public CustomResponse<?> addBrand(@RequestBody AdminBrandRequest brandRequest) {
        return new CustomResponse<>(brandService.saveAdmin(brandRequest));
    }

    @PutMapping("/admin/brands/{id}")
    public CustomResponse<?> updateBrand(@PathVariable String id, @RequestBody AdminBrandRequest brandRequest) {
        return new CustomResponse<>(brandService.updateAdmin(id, brandRequest));
    }

    @DeleteMapping("/admin/brands/{id}")
    public CustomResponse<?> deleteBrand(@PathVariable String id) {
        return new CustomResponse<>(brandService.deleteById(id));
    }
}
