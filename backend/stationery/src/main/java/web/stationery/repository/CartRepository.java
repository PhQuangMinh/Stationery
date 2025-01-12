package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
}
