package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.brandrequest.AdminBrandRequest;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;
import web.stationery.repository.BrandRepository;
import web.stationery.service.BrandService;
import web.stationery.utils.mapper.BrandMapper;

import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Override
    public Page<BrandResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Brand> brands = brandRepository.findAll(pageable);
        List<BrandResponse> brandResponses = brandMapper.toResponseList(brands.getContent());
        return new PageImpl<>(brandResponses, pageable, brands.getTotalElements());
    }

    @Override
    public Page<BrandResponse> findAllByName(int size, int page, String sortBy, String name) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Brand> brands = brandRepository.findByNameContainingIgnoreCase(name, pageable);
        List<BrandResponse> brandResponses = brandMapper.toResponseList(brands.getContent());
        return new PageImpl<>(brandResponses, pageable, brands.getTotalElements());
    }

    @Override
    public BrandResponse findById(String id) {
        Brand brand = findBrandById(id);
        return brandMapper.toResponse(brand);
    }

    @Override
    public BrandResponse findByName(String name) {
        Optional<Brand> brand = brandRepository.findByName(name);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + name);
        return brandMapper.toResponse(brand.get());
    }

    @Override
    public List<BrandResponse> findAllFull() {
        List<Brand> brands = brandRepository.findAll();
        return brandMapper.toResponseList(brands);
    }

    @Override
    public Brand findBrandById(String id) {
        Optional<Brand> brand = brandRepository.findById(id);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + id);
        return brand.get();
    }

    @Override
    public BrandResponse save(BrandRequest brandRequest) {
        Brand brand = brandMapper.toEntity(brandRequest);
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    @Override
    public Brand saveAdmin(AdminBrandRequest brandRequest) {
        Brand brand = brandMapper.toEntity(brandRequest);
        brand.setDeleteFlag(brandRequest.isDeleteFlag());
        return brandRepository.save(brand);
    }

    @Override
    public BrandResponse update(String id, BrandRequest brandRequest) {
        Brand existingBrand = findBrandById(id);
        brandMapper.updateBrand(existingBrand, brandRequest);
        return brandMapper.toResponse(brandRepository.save(existingBrand));
    }

    @Override
    public Brand updateAdmin(String id, AdminBrandRequest brandRequest) {
        Brand existingBrand = findBrandById(id);
        brandMapper.updateBrand(existingBrand, brandRequest);
        existingBrand.setDeleteFlag(brandRequest.isDeleteFlag());
        return brandRepository.save(existingBrand);
    }

    @Override
    public BrandResponse deleteById(String id) {
        Brand brand = findBrandById(id);
        brand.setDeleteFlag(true);
        return brandMapper.toResponse(brandRepository.save(brand));
    }
}
