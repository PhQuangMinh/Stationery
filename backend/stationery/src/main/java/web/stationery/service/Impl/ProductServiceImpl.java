package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.productrequest.AdminProductRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.productresponse.ProductResponse;
import web.stationery.model.Brand;
import web.stationery.model.Category;
import web.stationery.model.Product;
import web.stationery.repository.BrandRepository;
import web.stationery.repository.CategoryRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.service.BrandService;
import web.stationery.service.ProductService;
import web.stationery.utils.mapper.ProductMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final BrandRepository brandRepository;

    private final CategoryRepository categoryRepository;

    private final BrandService brandService;

    @Override
    public Page<ProductResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Product> products = productRepository.findAll(pageable);
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
    public ProductResponse update(String id, ProductRequest productRequest) {
        Optional<Product> findProduct = productRepository.findById(String.valueOf(id));
        if (findProduct.isEmpty()) throw new NotFoundException("Product not found - " + id);
        productMapper.updateProduct(findProduct.get(), productRequest);
        Optional<Brand> brand = brandRepository.findByName(productRequest.getBrand().getName());
        if (brand.isEmpty()){
            throw  new NotFoundException("Brand not found - " + productRequest.getBrand().getName());
        }
        findProduct.get().setBrand(brand.get());
        Optional<Category> category = categoryRepository.findByName(productRequest.getCategory().getName());
        if (category.isEmpty()){
            throw  new NotFoundException("Category not found - " + productRequest.getCategory().getName());
        }
        findProduct.get().setCategory(category.get());
        return productMapper.toResponse(productRepository.save(findProduct.get()));
    }

    @Override
    public void deleteById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        productRepository.delete(product.get());
    }

    @Override
    public ProductResponse getBestSellingProduct() {
        Optional<Product> findProduct = productRepository.findTopByOrderByCountSalesDesc();
        if (findProduct.isEmpty()) throw new NotFoundException("Product not found");
        return productMapper.toResponse(findProduct.get());
    }

    @Override
    public Product saveAdmin(AdminProductRequest productRequest) {
        Product product = productMapper.toEntity(productRequest);
        Optional<Brand> findBrand = brandRepository.findByName(productRequest.getBrand().getName());
        if (findBrand.isEmpty()) throw new NotFoundException("Brand not found - " + productRequest.getBrand().getName());
        product.setBrand(findBrand.get());
        Optional<Category> findCategory = categoryRepository.findByName(productRequest.getCategory().getName());
        if (findCategory.isEmpty()) throw new NotFoundException("Category not found - " + productRequest.getCategory().getName());
        product.setCategory(findCategory.get());
        product.setDeleteFlag(productRequest.isDeleteFlag());
        return productRepository.save(product);
    }

    @Override
    public Product updateAdmin(AdminProductRequest productRequest) {
        Optional<Product> findProduct = productRepository.findById(String.valueOf(productRequest.getId()));
        if (findProduct.isEmpty()) throw new NotFoundException("Product not found - " + productRequest.getId());

        Product existingProduct = findProduct.get();

        Brand updateBrand = brandService.findBrandByName(productRequest.getBrand().getName());
        productMapper.updateProduct(existingProduct, productRequest);
        existingProduct.setBrand(updateBrand);
        Optional<Category> findCategory = categoryRepository.findByName(productRequest.getCategory().getName());
        if (findCategory.isEmpty()) throw new NotFoundException("Category not found - " + productRequest.getCategory().getName());
        existingProduct.setCategory(findCategory.get());
        existingProduct.setDeleteFlag(productRequest.isDeleteFlag());

        return productRepository.save(existingProduct);
    }

    @Override
    public List<ProductResponse> getRandomProductsByCategory(String categoryName) {
        List<Product> products = productRepository.findRandomProductsByCategory(categoryName);
        if (products.isEmpty()) {
            return new ArrayList<ProductResponse>();
        }
        return productMapper.toResponseList(products);
    }

    @Override
    public List<ProductResponse> getRandomDiscountProducts() {
        List<Product> products = productRepository.findRandomDiscountProducts();
        if (products.isEmpty()) {
            throw new NotFoundException("No discount products found");
        }
        return productMapper.toResponseList(products);
    }

    @Override
    public Page<ProductResponse> findByCategoryName(int size, int page, String sortBy, String categoryName) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Product> productPage = productRepository.findByCategoryName(categoryName, pageable);
        List<ProductResponse> productResponses = productMapper.toResponseList(productPage.getContent());
        return new PageImpl<>(productResponses, pageable, productPage.getTotalElements());
    }

    @Override
    public Page<ProductResponse> searchByName(String keyword, int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Product> productPage = productRepository.searchByNameContaining(keyword, pageable);
        List<ProductResponse> productResponses = productMapper.toResponseList(productPage.getContent());
        return new PageImpl<>(productResponses, pageable, productPage.getTotalElements());
    }

}
