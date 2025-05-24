package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import web.stationery.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM cartitems WHERE cart_id = :cartId", nativeQuery = true)
    void deleteByCartIdNative(@Param("cartId") Integer cartId);
}
