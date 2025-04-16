package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import web.stationery.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, String> {
}
