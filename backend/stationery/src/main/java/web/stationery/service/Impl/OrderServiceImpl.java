package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.CartResponse;
import web.stationery.dto.response.OrderResponse;
import web.stationery.model.User;
import web.stationery.model.UserOrder;
import web.stationery.repository.OrderRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.service.OrderService;
import web.stationery.utils.mapper.OrderMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    private final OrderMapper orderMapper = new OrderMapper();

    private final ProductRepository productRepository;


    @Override
    public Page<OrderResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<UserOrder> ordersPage = orderRepository.findAll(pageable);
        List<OrderResponse> orderResponses = orderMapper.toResponseList(ordersPage.getContent());
        return new PageImpl<>(orderResponses);
    }

    @Override
    public OrderResponse findById(String id) {
        Optional<UserOrder> findOrder = orderRepository.findById(id);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found - " + id);
        }
        return orderMapper.toResponse(findOrder.get());
    }

    @Override
    public OrderResponse getOrderUser(User user) {
        Optional<UserOrder> findOrder = orderRepository.findByUser(user);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found for user - " + user.getId());
        }
        return orderMapper.toResponse(findOrder.get());
    }

    @Override
    public OrderResponse updateOrder(User user, OrderRequest orderRequest) {
        Optional<UserOrder> findOrder = orderRepository.findByUser(user);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found for user - " + user.getId());
        }
        orderMapper.updateOrder(findOrder.get(), orderRequest);
        return orderMapper.toResponse(orderRepository.save(findOrder.get()));
    }

    @Override
    public OrderResponse save(User user, OrderRequest orderRequest) {
        return orderMapper.toResponse(orderRepository.save(orderMapper.toEntity(orderRequest, user, productRepository)));
    }

    @Override
    public OrderResponse deleteById(String id) {
        Optional<UserOrder> findOrder = orderRepository.findById(id);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found - " + id);
        }
        findOrder.get().setDeleteFlag(true);
        return orderMapper.toResponse(orderRepository.save(findOrder.get()));
    }
}
