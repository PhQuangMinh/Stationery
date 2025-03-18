package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.brandrequest.AdminBrandRequest;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.brandresponse.BrandAdminResponse;
import web.stationery.dto.response.brandresponse.BrandResponse;
import web.stationery.model.Brand;

import java.util.List;

public interface BrandService {
    Page<BrandResponse> findAllDeleteFlagFalse(int size, int page, String sortBy);
    Page<BrandResponse> findAllByName(int size, int page, String sortBy, String name);
    List<BrandAdminResponse> findAllFull();

    Brand findBrandById(String id);
    Brand saveAdmin(AdminBrandRequest brandRequest);
    Brand updateAdmin(String id, AdminBrandRequest brandRequest);
    Brand findBrandByName(String name);
}
