package web.stationery.utils.mapper;

import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;

import java.util.ArrayList;
import java.util.List;

public class BrandMapper {
    public List<BrandResponse> toResponseList(List<Brand> brandList){
        List<BrandResponse> brandResponses = new ArrayList<>();
        for (Brand brand:brandList){
            brandResponses.add(toResponse(brand));
        }
        return brandResponses;
    }
    public BrandResponse toResponse(Brand brand){
        return new BrandResponse(brand.getId(), brand.getName());
    }

    public Brand toEntity(BrandRequest brandRequest){
        Brand brand = new Brand();
        brand.setName(brandRequest.getName());
        return brand;
    }
}
