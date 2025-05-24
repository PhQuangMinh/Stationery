package web.stationery.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import web.stationery.dto.response.productresponse.ProductStatisticProjection;
import web.stationery.dto.response.productresponse.ProductStatisticResponse;
import web.stationery.model.Product;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;


@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    @Query("SELECT p FROM Product p WHERE p.deleteFlag = false ORDER BY p.countSales DESC")
    Optional<Product> findTopByOrderByCountSalesDesc();
    @Query("SELECT p FROM Product p JOIN p.category c WHERE c.name = :categoryName AND p.deleteFlag = false ORDER BY FUNCTION('RAND') LIMIT 4")
    List<Product> findRandomProductsByCategory(@Param("categoryName") String categoryName);
    @Query("SELECT p FROM Product p WHERE p.discount > 0 AND p.deleteFlag = false ORDER BY RAND() LIMIT 4")
    List<Product> findRandomDiscountProducts();
    @Query("SELECT p FROM Product p JOIN p.category c WHERE c.name = :categoryName AND p.deleteFlag = false")
    Page<Product> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);
    List<Product> findByUpdatedAtAfterAndDeleteFlagFalse(Timestamp lastSyncTime);
    List<Product> findByDeleteFlagFalse();

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) AND p.deleteFlag = false")
    Page<Product> searchByNameContaining(@Param("keyword") String keyword, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.deleteFlag = :deleteFlag WHERE p.brand.id = :brandId")
    void updateDeleteFlagForBrand(@Param("brandId") int brandId, @Param("deleteFlag") boolean deleteFlag);

    @Query(value = """
    SELECT p.name AS name,
           SUM(od.quantity) AS soldQuantity,
           SUM(od.quantity * p.price) AS revenue
    FROM orderitems od
    JOIN products p ON od.product_id = p.id
    JOIN userorders o ON od.order_id = o.id
    WHERE o.status = 'Đã thanh toán'
    AND YEAR(o.order_date) = :year
    GROUP BY p.name
    ORDER BY soldQuantity DESC
    LIMIT 5
    """, nativeQuery = true)
    List<ProductStatisticProjection> findTop5BestSellingProducts(@Param("year") int year);
}
