package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Product;


@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
}
