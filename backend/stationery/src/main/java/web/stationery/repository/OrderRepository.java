package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.UserOrder;

@Repository
public interface OrderRepository extends JpaRepository<UserOrder, String> {
}
