package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.User;
import web.stationery.model.UserOrder;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<UserOrder, String> {
    Optional<UserOrder> findByUser(User user);
}
