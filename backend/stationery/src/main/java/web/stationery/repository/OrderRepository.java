package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web.stationery.model.User;
import web.stationery.model.UserOrder;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<UserOrder, String> {
    Optional<List<UserOrder>> findByUser(User user);
    List<UserOrder> findOrdersByUser(User user);
    Optional<UserOrder> findByTxnRef(String txnRef);
    
    @Query(value = "SELECT * FROM userorders WHERE DATE(order_date) = CURDATE() AND YEAR(order_date) = :year", nativeQuery = true)
    List<UserOrder> findTodayOrders(@Param("year") int year);

    @Query(value = """
    SELECT MONTH(order_date) AS month, SUM(total_order) AS revenue
    FROM userorders
    WHERE status = 'Đã hoàn thành' AND YEAR(order_date) = :year
    GROUP BY MONTH(order_date)
    ORDER BY month
    """, nativeQuery = true)
    List<Object[]> getRevenueByMonth(@Param("year") int year);
}
