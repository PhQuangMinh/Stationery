package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.OrderResponse;
import web.stationery.model.User;
import web.stationery.model.UserOrder;

public interface OrderService {
    Page<OrderResponse> findAll(int size, int page, String sortBy);
    OrderResponse findById(String id);
    OrderResponse getOrderUser(User user);
    OrderResponse updateOrder(User user, OrderRequest orderRequest);
    OrderResponse save(User user, OrderRequest orderRequest);
    void deleteById(String id);
    OrderResponse getLastOrder(String username);
    UserOrder findOrderById(String id);
    OrderResponse updateOrderAdmin(String id, OrderRequest orderRequest);
}
