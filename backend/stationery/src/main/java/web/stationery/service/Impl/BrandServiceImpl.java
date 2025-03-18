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
import web.stationery.dto.response.brandresponse.BrandAdminResponse;
import web.stationery.dto.response.brandresponse.BrandResponse;
import web.stationery.model.Brand;
import web.stationery.repository.BrandRepository;
import web.stationery.service.BrandService;
import web.stationery.utils.mapper.BrandMapper;
import web.stationery.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    private final ProductRepository productRepository;
    private static final Logger logger = LoggerFactory.getLogger(BrandServiceImpl.class);

    @Override
    public Page<BrandResponse> findAllDeleteFlagFalse(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Brand> brands = brandRepository.findByDeleteFlagFalse(pageable);
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
    public List<BrandAdminResponse> findAllFull() {
        List<Brand> brands = brandRepository.findAll();
        return brandMapper.toAdminResponseList(brands);
    }

    @Override
    public Brand findBrandById(String id) {
        Optional<Brand> brand = brandRepository.findById(Integer.valueOf(id));
        if (brand.isEmpty()) throw new NotFoundException("Brand not found - " + id);
        return brand.get();
    }

    @Override
    public Brand saveAdmin(AdminBrandRequest brandRequest) {
        Brand brand = brandMapper.toEntity(brandRequest);
        brand.setDeleteFlag(brandRequest.isDeleteFlag());
        return brandRepository.save(brand);
    }

    @Override
    public Brand updateAdmin(String id, AdminBrandRequest brandRequest) {
        Brand existingBrand = findBrandById(id);
        boolean brandBeingDeleted = !existingBrand.isDeleteFlag() && brandRequest.isDeleteFlag();
        existingBrand.setName(brandRequest.getName());
        existingBrand.setDeleteFlag(brandRequest.isDeleteFlag());
        Brand updatedBrand = brandRepository.save(existingBrand);
        if (brandBeingDeleted) {
            markProductsAsDeleted(existingBrand.getId());
        }
        
        return updatedBrand;
    }

    private void markProductsAsDeleted(int brandId) {
        productRepository.updateDeleteFlagForBrand(brandId, true);
        logger.info("Đã đánh dấu xóa tất cả sản phẩm thuộc brand ID={}", brandId);
    }

    @Override
    public Brand findBrandByName(String name) {
        Optional<Brand> findBrand = brandRepository.findByName(name);
        return findBrand.orElseThrow(() -> new NotFoundException("Brand not found - " + name));
    }
}
