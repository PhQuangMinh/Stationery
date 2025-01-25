package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;

public interface BrandService {
    Page<BrandResponse> findAll(int size, int page, String sortBy);
    BrandResponse findByName(String name);
    BrandResponse save(BrandRequest brand);
    BrandResponse deleteByName(String name);
    Page<BrandResponse> findAllByName(int size, int page, String sortBy, String name);
}
