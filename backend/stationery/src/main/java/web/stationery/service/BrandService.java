package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Brand;

public interface BrandService {
    Page<Brand> findAll(int size, int page, String sortBy);
    Brand findById(String id);
    Brand save(Brand brand);
    void deleteById(String id);
}
