package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.OrderResponse;
import web.stationery.model.User;

public interface OrderService {
    Page<OrderResponse> findAll(int size, int page, String sortBy);
    OrderResponse findById(String id);
    OrderResponse getOrderUser(User user);
    OrderResponse updateOrder(User user, OrderRequest orderRequest);
    OrderResponse save(User user, OrderRequest orderRequest);
    OrderResponse deleteById(String id);
}
