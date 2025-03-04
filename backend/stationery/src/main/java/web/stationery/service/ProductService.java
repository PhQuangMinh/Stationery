package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.productrequest.AdminProductRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;

import javax.swing.text.Element;

public interface ProductService {
    Page<ProductResponse> findAll(int size, int page, String sortBy);
    Page<ProductResponse> findAllByName(int size, int page, String sortBy, String name);
    ProductResponse findById(String id);
    Product findProductById(String id);
    ProductResponse update(String id, ProductRequest productRequest);
    void deleteById(String id);
    ProductResponse getBestSellingProduct();
    Product saveAdmin(AdminProductRequest productRequest);
    Product updateAdmin(AdminProductRequest productRequest);
}
