package web.stationery.utils.mapper;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import web.stationery.common.exception.NotFoundException;
import web.stationery.dto.request.OrderItemRequest;
import web.stationery.dto.request.OrderRequest;
import web.stationery.dto.response.OrderItemResponse;
import web.stationery.dto.response.OrderResponse;
import web.stationery.dto.response.UserResponse;
import web.stationery.model.OrderItem;
import web.stationery.model.Product;
import web.stationery.model.User;
import web.stationery.model.UserOrder;
import web.stationery.repository.ProductRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
public class OrderMapper {

    public List<OrderResponse> toResponseList(List<UserOrder> userOrderList){
        List<OrderResponse> orderResponses = new ArrayList<>();
        for (UserOrder userOrder:userOrderList){
            orderResponses.add(toResponse(userOrder));
        }
        return orderResponses;
    }

    public long getTotalAmount(List<OrderItem> orderItems){
        long total = 0;
        for (OrderItem orderItem:orderItems){
            total += (long)orderItem.getProduct().getPrice()*orderItem.getQuantity();
        }
        return total;
    }

    public OrderResponse toResponse(UserOrder userOrder){
        List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        for (OrderItem orderItem:userOrder.getOrderItems()){
            orderItemResponses.add(new OrderItemResponse(orderItem.getId()
                    , orderItem.getProduct().getName()
                    , orderItem.getQuantity()
                    , orderItem.getProduct().getPrice()
                    , orderItem.getProduct().getImageUrl()
                    , orderItem.getProduct().getId()));
        }
        return new OrderResponse(
                String.valueOf(userOrder.getId())
                , userOrder.getOrderDate()
                , getTotalAmount(userOrder.getOrderItems())
                , userOrder.getStatus()
                , userOrder.getShippingAddress()
                , userOrder.getPaymentMethod()
                , userOrder.getTxnRef()
                , new UserResponse(userOrder.getUser().getId(), userOrder.getUser().getName(), userOrder.getUser().getPhone())
                , orderItemResponses);
    }

    public void updateOrderAdmin(UserOrder userOrder, OrderRequest orderRequest){
        userOrder.setStatus(orderRequest.getStatus());
        userOrder.setShippingAddress(orderRequest.getShippingAddress());
        userOrder.setPaymentMethod(orderRequest.getPaymentMethod());
    }

    public UserOrder toEntity(OrderRequest orderRequest, User user, ProductRepository productRepository){
        UserOrder userOrder = new UserOrder();
        userOrder.setOrderItems(new ArrayList<>());
        userOrder.setUser(user);
        userOrder.setStatus(orderRequest.getStatus());
        userOrder.setShippingAddress(orderRequest.getShippingAddress());
        userOrder.setPaymentMethod(orderRequest.getPaymentMethod());
        userOrder.setTxnRef(orderRequest.getTxnRef());
        int totalOrder = 0;
        for (OrderItemRequest orderItemRequest: orderRequest.getOrderItemRequests()){
            OrderItem orderItem = new OrderItem();
            Optional<Product> findProduct = productRepository.findById(String.valueOf(orderItemRequest.getProductId()));
            if (findProduct.isEmpty()){
                throw new NotFoundException("Product not found - " + orderItemRequest.getProductId());
            }
            orderItem.setOrder(userOrder);
            orderItem.setProduct(findProduct.get());
            orderItem.setQuantity(orderItemRequest.getQuantity());
            totalOrder = orderItem.getProduct().getPrice()*orderItemRequest.getQuantity();
            userOrder.getOrderItems().add(orderItem);
        }
        return userOrder;
    }
}
