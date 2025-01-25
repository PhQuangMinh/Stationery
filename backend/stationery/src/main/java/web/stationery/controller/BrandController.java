package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.dto.response.CustomResponse;
import web.stationery.model.Brand;
import web.stationery.service.BrandService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/brands")
public class BrandController {
    private final BrandService brandService;

    @PostMapping()
    public CustomResponse<?> createBrand(@RequestBody BrandRequest brand) {
        return new CustomResponse<>(brandService.save(brand));
    }

    @GetMapping()
    public CustomResponse<BrandResponse> findByName(@RequestParam String name){
        return new CustomResponse<>(brandService.findByName(name));
    }

    @GetMapping("/all-name")
    public CustomResponse<?> findAllByName(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam String name
    ){
        return new CustomResponse<>(brandService.findAllByName(size, page, sortBy, name));
    }

    @GetMapping("/all")
    public CustomResponse<Page<BrandResponse>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(brandService.findAll(size, page, sortBy));
    }

    @PutMapping()
    public CustomResponse<BrandResponse> updateBrand(@RequestBody BrandRequest brand){
        return new CustomResponse<>(brandService.save(brand));
    }

    @DeleteMapping()
    public CustomResponse<BrandResponse> deleteBrand(@RequestParam String name){
        return new CustomResponse<>(brandService.deleteByName(name));
    }

}
