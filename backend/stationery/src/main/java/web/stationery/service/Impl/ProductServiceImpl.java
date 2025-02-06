package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Brand;
import web.stationery.model.Category;
import web.stationery.model.Product;
import web.stationery.repository.BrandRepository;
import web.stationery.repository.CategoryRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.service.ProductService;
import web.stationery.utils.mapper.ProductMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final BrandRepository brandRepository;

    private final CategoryRepository categoryRepository;

    @Override
    public Page<ProductResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Product> products = productRepository.findAll(pageable);
        List<ProductResponse> productResponses = productMapper.toResponseList(products.getContent());
        return new PageImpl<>(productResponses, pageable, products.getTotalElements());
    }

    @Override
    public Page<ProductResponse> findAllByName(int size, int page, String sortBy, String name) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Product> products = productRepository.findByNameContainingIgnoreCase(name, pageable);
        List<ProductResponse> productResponses = productMapper.toResponseList(products.getContent());
        return new PageImpl<>(productResponses, pageable, products.getTotalElements());
    }

    @Override
    public ProductResponse findById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        return productMapper.toResponse(product.get());
    }

    @Override
    public Product findProductById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        return product.get();
    }

    @Override
    public ProductResponse save(ProductRequest productRequest) {
        Product product = productMapper.toEntity(productRequest);
        Optional<Brand> findBrand = brandRepository.findByName(productRequest.getBrand().getName());
        if (findBrand.isEmpty()) throw new NotFoundException("Brand not found - " + productRequest.getBrand().getName());
        product.setBrand(findBrand.get());
        List<Category> categories = productRequest.getCategories().stream().map(
                categoryRequest -> {
                    Optional<Category> findCategory = categoryRepository.findByName(categoryRequest.getName());
                    if (findCategory.isEmpty()) throw new NotFoundException("Category not found - " + categoryRequest.getName());
                    return findCategory.get();
                }
        ).toList();
        product.setCategories(categories);
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse update(String id, ProductRequest productRequest) {
        Optional<Product> findProduct = productRepository.findById(String.valueOf(id));
        if (findProduct.isEmpty()) throw new NotFoundException("Product not found - " + id);
        productMapper.updateProduct(findProduct.get(), productRequest);
        return productMapper.toResponse(findProduct.get());
    }

    @Override
    public ProductResponse deleteById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        product.get().setDeleteFlag(true);
        return productMapper.toResponse(productRepository.save(product.get()));
    }

    @Override
    public ProductResponse getBestSellingProduct() {
        Optional<Product> findProduct = productRepository.findTopByOrderByCountSalesDesc();
        if (findProduct.isEmpty()) throw new NotFoundException("Product not found");
        return productMapper.toResponse(findProduct.get());
    }
}
