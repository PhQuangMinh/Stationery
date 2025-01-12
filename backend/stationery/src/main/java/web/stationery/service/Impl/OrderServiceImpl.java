package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.UserOrder;
import web.stationery.repository.OrderRepository;
import web.stationery.service.OrderService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    @Override
    public Page<UserOrder> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return orderRepository.findAll(pageable);
    }

    @Override
    public UserOrder findById(String id) {
        Optional<UserOrder> order = orderRepository.findById(id);
        if (order.isEmpty()) throw new NotFoundException("Order not found - " + id);
        return order.get();
    }

    @Override
    public UserOrder save(UserOrder order) {
        return orderRepository.save(order);
    }

    @Override
    public void deleteById(String id) {
        Optional<UserOrder> order = orderRepository.findById(id);
        if (order.isEmpty()) throw new NotFoundException("Order not found - " + id);
        orderRepository.deleteById(id);
    }
}
