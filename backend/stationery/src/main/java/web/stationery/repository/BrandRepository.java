package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, String> {
}
