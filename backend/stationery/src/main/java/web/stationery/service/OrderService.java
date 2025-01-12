package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.UserOrder;

public interface OrderService {
    Page<UserOrder> findAll(int size, int page, String sortBy);
    UserOrder findById(String id);
    UserOrder save(UserOrder order);
    void deleteById(String id);
}
