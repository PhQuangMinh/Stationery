package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.brandrequest.AdminBrandRequest;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;

import java.util.List;

public interface BrandService {
    // Các phương thức cho user thông thường
    Page<BrandResponse> findAll(int size, int page, String sortBy);
    Page<BrandResponse> findAllByName(int size, int page, String sortBy, String name);
    BrandResponse findById(String id);
    BrandResponse findByName(String name);
    List<BrandResponse> findAllFull();

    // Các phương thức cho admin
    Brand findBrandById(String id);
    BrandResponse save(BrandRequest brandRequest);
    Brand saveAdmin(AdminBrandRequest brandRequest);
    BrandResponse update(String id, BrandRequest brandRequest);
    Brand updateAdmin(String id, AdminBrandRequest brandRequest);
    BrandResponse deleteById(String id);
}
