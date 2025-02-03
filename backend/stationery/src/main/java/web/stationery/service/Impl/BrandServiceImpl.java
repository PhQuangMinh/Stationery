package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.brandrequest.BrandRequest;
import web.stationery.dto.response.BrandResponse;
import web.stationery.model.Brand;
import web.stationery.repository.BrandRepository;
import web.stationery.service.BrandService;
import web.stationery.utils.mapper.BrandMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;

    private final BrandMapper brandMapper = new BrandMapper();

    @Override
    public Page<BrandResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Brand> brands = brandRepository.findAll(pageable);
        List<BrandResponse> brandResponses = brandMapper.toResponseList(brands.getContent());
        System.out.println(brandResponses);
        return new PageImpl<>(brandResponses, pageable, brands.getTotalElements());
    }

    @Override
    public BrandResponse findByName(String name) {
        Optional<Brand> brand = brandRepository.findByName(name);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + name);
        return brandMapper.toResponse(brand.get());
    }

    @Override
    public BrandResponse save(BrandRequest brandRequest) {
        Brand brand = brandMapper.toEntity(brandRequest);
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    @Override
    public BrandResponse deleteByName(String name) {
        Optional<Brand> brand = brandRepository.findByName(name);
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + name);
        brand.get().setDeleteFlag(true);
        return brandMapper.toResponse(brandRepository.save(brand.get()));
    }

    @Override
    public Page<BrandResponse> findAllByName(int size, int page, String sortBy, String name) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Brand> brands = brandRepository.findByNameContainingIgnoreCase(name, pageable);
        List<BrandResponse> brandResponses = brandMapper.toResponseList(brands.getContent());
        return new PageImpl<>(brandResponses, pageable, brands.getTotalElements());
    }
}
