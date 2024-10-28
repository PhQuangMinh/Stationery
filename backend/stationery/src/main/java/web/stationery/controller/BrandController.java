package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Brand;
import web.stationery.service.BrandService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/brands")
public class BrandController {
    private final BrandService brandService;

    @PostMapping()
    public Brand createBrand(@RequestBody Brand brand) {
        return brandService.save(brand);
    }

    @GetMapping("/{id}")
    public CustomResponse<Brand> findById(@PathVariable int id){
        return new CustomResponse<>(brandService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Brand>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(brandService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Brand> updateBrand(@RequestBody Brand brand){
        return new CustomResponse<>(brandService.save(brand));
    }

    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable String id){
        brandService.deleteById(id);
    }

}
