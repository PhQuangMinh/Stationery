package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web.stationery.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}
