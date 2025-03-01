package web.stationery.utils.mapper;

import org.springframework.stereotype.Component;
import web.stationery.dto.request.brandrequest.AdminBrandRequest;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class BrandMapper {
    
    public Brand toEntity(BrandRequest request) {
        if (request == null) {
            return null;
        }

        Brand brand = new Brand();
        brand.setName(request.getName());
        
        return brand;
    }

    public BrandResponse toResponse(Brand brand) {
        if (brand == null) {
            return null;
        }

        BrandResponse response = new BrandResponse();
        response.setId(brand.getId());
        response.setName(brand.getName());
        
        return response;
    }

    public List<BrandResponse> toResponseList(List<Brand> brands) {
        if (brands == null) {
            return Collections.emptyList();
        }
        return brands.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void updateBrand(Brand brand, BrandRequest brandRequest) {
        // Implementation of updateBrand method
    }

    public void updateBrand(Brand brand, AdminBrandRequest adminBrandRequest) {
        // Implementation of updateBrand method
    }
}
