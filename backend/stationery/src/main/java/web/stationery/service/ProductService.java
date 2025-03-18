package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.productrequest.AdminProductRequest;
import web.stationery.dto.request.productrequest.ProductRequest;
import web.stationery.dto.response.ProductResponse;
import web.stationery.model.Product;

import javax.swing.text.Element;
import java.util.List;

public interface ProductService {
    Page<ProductResponse> findAll(int size, int page, String sortBy);
    ProductResponse findById(String id);
    Product findProductById(String id);
    ProductResponse update(String id, ProductRequest productRequest);
    void deleteById(String id);
    ProductResponse getBestSellingProduct();
    Product saveAdmin(AdminProductRequest productRequest);
    Product updateAdmin(AdminProductRequest productRequest);
    List<ProductResponse> getRandomProductsByCategory(String categoryName);
    List<ProductResponse> getRandomDiscountProducts();
    Page<ProductResponse> findByCategoryName(int size, int page, String sortBy, String categoryName);
}
