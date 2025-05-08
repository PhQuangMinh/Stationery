package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web.stationery.common.exception.AuthorizingException;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.OrderItemRequest;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.OrderResponse;
import web.stationery.model.*;
import web.stationery.repository.*;
import web.stationery.service.CartService;
import web.stationery.service.OrderService;
import web.stationery.service.UserService;
import web.stationery.utils.mapper.OrderMapper;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;

    private final OrderMapper orderMapper = new OrderMapper();

    private final ProductRepository productRepository;

    private final UserService userService;

    private final OrderItemRepository orderItemRepository;

    private final CartItemRepository cartItemRepository;


    @Override
    public Page<OrderResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<UserOrder> ordersPage = orderRepository.findAll(pageable);
        List<OrderResponse> orderResponses = orderMapper.toResponseList(ordersPage.getContent());
        return new PageImpl<>(orderResponses, pageable, ordersPage.getTotalElements());
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
    public List<OrderResponse> getOrderUser(User user) {
        Optional<List<UserOrder>> findOrder = orderRepository.findByUser(user);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found for user - " + user.getId());
        }
        return orderMapper.toResponseList(findOrder.get());
    }

    @Override
    @Transactional
    public OrderResponse save(User user, OrderRequest orderRequest) {
        String txnRef = String.valueOf(System.currentTimeMillis()).substring(5); 
        orderRequest.setTxnRef(txnRef);

        for (OrderItemRequest itemRequest : orderRequest.getOrderItemRequests()) {
            Optional<Product> optionalProduct = productRepository.findById(itemRequest.getProductId());
            if (optionalProduct.isEmpty()) {
                throw new NotFoundException("Cart item not found - " + itemRequest.getId());
            }

            if (optionalProduct.get().getQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Not enough quantity for product ID: " + itemRequest.getProductId());
            }
        }
        UserOrder order = orderMapper.toEntity(orderRequest, user, productRepository);
        orderRepository.save(order);
        for (OrderItemRequest itemRequest : orderRequest.getOrderItemRequests()) {
            Optional<Product> findProduct = productRepository.findById(itemRequest.getProductId());
            if (findProduct.isEmpty()) {
                throw new NotFoundException("Product not found - " + itemRequest.getProductId());
            }
            findProduct.get().setQuantity(findProduct.get().getQuantity() - itemRequest.getQuantity());
            productRepository.save(findProduct.get());
        }
        for (CartItem cartItem : user.getCart().getCartItems()) {
            cartItemRepository.save(cartItem);
        }

        return orderMapper.toResponse(order);
    }

    @Override
    public void deleteById(String id) {
        Optional<UserOrder> order = orderRepository.findById(id);
        if (order.isEmpty()) {
            throw new NotFoundException("Order not found - " + id);
        }
        orderRepository.deleteById(id);
    }

    @Override
    public OrderResponse getLastOrder(String username) {
        User user = userService.findUserByUsername(username);
        List<UserOrder> orders = orderRepository.findOrdersByUser(user);
        if (orders.isEmpty()){
            throw new NotFoundException("No orders found for user - " + username);
        }
        return orderMapper.toResponse(orders.getLast());
    }

    @Override
    public OrderResponse updateOrderAdmin(String id, OrderRequest orderRequest) {
        Optional<UserOrder> findOrder = orderRepository.findById(id);
        if (findOrder.isEmpty()){
            throw new NotFoundException("Order not found - " + id);
        }
//        if (Objects.equals(orderRequest.getStatus(), "COMPLETED") && !Objects.equals(findOrder.get().getStatus(), "COMPLETED")){
//            for (OrderItemRequest itemRequest : orderRequest.getOrderItemRequests()) {
//                Optional<OrderItem> orderItem = orderItemRepository.findById(itemRequest.getId());
//                orderItem.get().getProduct().setQuantity(orderItem.get().getProduct().getQuantity() - itemRequest.getQuantity());
//                productRepository.save(orderItem.get().getProduct());
//            }
//        }
        orderMapper.updateOrderAdmin(findOrder.get(), orderRequest);
        return orderMapper.toResponse(orderRepository.save(findOrder.get()));
    }

    @Override
    public OrderResponse cancelOrder(String orderId) {
        Optional<UserOrder> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new NotFoundException("Order not found - " + orderId);
        }
        
        order.get().setDeleteFlag(true);
        order.get().setStatus("Hủy");
        return orderMapper.toResponse(orderRepository.save(order.get()));
    }

    @Override
    public void updateOrderAfterPayment(String txnRef, String status) {
        Optional<UserOrder> order = orderRepository.findByTxnRef(txnRef);
        if (order.isEmpty()) {
            throw new NotFoundException("Order not found with transaction reference: " + txnRef);
        }

        if ("00".equals(status)) {
            order.get().setStatus("Đã thanh toán");
        }
        orderRepository.save(order.get());
    }

    @Override
    public OrderResponse getOrderDetailByUser(String username, String orderId) {
        User user = userService.findUserByUsername(username);
        Optional<UserOrder> order = orderRepository.findById(orderId);
        
        if (order.isEmpty()) {
            throw new NotFoundException("Order not found - " + orderId);
        }

        if (!order.get().getUser().getId().equals(user.getId())) {
            throw new AuthorizingException("You don't have permission to view this order");
        }
        
        return orderMapper.toResponse(order.get());
    }
}
