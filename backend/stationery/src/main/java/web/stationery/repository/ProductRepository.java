package web.stationery.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web.stationery.model.Product;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByNameContainingIgnoreCase(String name);
    @Query("SELECT p FROM Product p WHERE p.deleteFlag = false ORDER BY p.countSales DESC")
    Optional<Product> findTopByOrderByCountSalesDesc();
    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.name = :categoryName AND p.deleteFlag = false ORDER BY FUNCTION('RAND') LIMIT 4")
    List<Product> findRandomProductsByCategory(@Param("categoryName") String categoryName);
    @Query("SELECT p FROM Product p WHERE p.discount > 0 AND p.deleteFlag = false ORDER BY RAND() LIMIT 4")
    List<Product> findRandomDiscountProducts();
    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.name = :categoryName AND p.deleteFlag = false")
    Page<Product> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);
}
