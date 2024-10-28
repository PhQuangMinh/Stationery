package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Brand;
import web.stationery.repository.BrandRepository;
import web.stationery.service.BrandService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;

    @Override
    public Page<Brand> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return brandRepository.findAll(pageable);
    }

    @Override
    public Brand findById(String id) {
        Optional<Brand> brand = brandRepository.findById(id);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + id);
        return brand.get();
    }

    @Override
    public Brand save(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public void deleteById(String id) {
        Optional<Brand> brand = brandRepository.findById(id);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + id);
        brandRepository.delete(brand.get());
    }
}
