package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Shipping;

@Repository
public interface ShippingRepository extends JpaRepository<Shipping, String> {
}
