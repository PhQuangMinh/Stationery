package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Product;

import javax.swing.text.Element;

public interface ProductService {
    Page<Product> findAll(int size, int page, String sortBy);
    Product findById(String id);
    Product save(Product product);
    void deleteById(String id);
}
