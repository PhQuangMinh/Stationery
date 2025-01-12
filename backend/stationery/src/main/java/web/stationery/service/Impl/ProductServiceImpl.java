package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Product;
import web.stationery.repository.ProductRepository;
import web.stationery.service.ProductService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public Page<Product> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return productRepository.findAll(pageable);
    }

    @Override
    public Product findById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        return product.get();
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteById(String id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isEmpty()) throw new NotFoundException("Product not found - " + id);
        productRepository.deleteById(id);
    }
}
