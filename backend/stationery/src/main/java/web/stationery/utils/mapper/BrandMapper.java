package web.stationery.utils.mapper;

import org.mapstruct.Mapper;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    List<BrandResponse> toResponseList(List<Brand> brandList);
    BrandResponse toResponse(Brand brand);
    Brand toEntity(BrandRequest brandRequest);
}
