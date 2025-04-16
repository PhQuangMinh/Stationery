package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.stationery.dto.response.productresponse.ProductStatisticProjection;
import web.stationery.dto.response.productresponse.ProductStatisticResponse;
import web.stationery.dto.response.statistics.RevenueByMonthResponse;
import web.stationery.dto.response.statistics.StatisticsResponse;
import web.stationery.dto.response.statistics.SummaryResponse;
import web.stationery.dto.response.statistics.TotalOrderStatus;
import web.stationery.model.UserOrder;
import web.stationery.repository.OrderRepository;
import web.stationery.repository.ProductRepository;
import web.stationery.service.OrderService;
import web.stationery.service.StatisticsService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsServiceImpl implements StatisticsService {
    private final OrderService orderService;

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;

    public SummaryResponse getSummary(List<UserOrder> userOrders) {
        long totalRevenue = 0;
        for (UserOrder userOrder:userOrders){
            totalRevenue += userOrder.getTotalOrder();
        }

        List<UserOrder> todayOrders = orderRepository.findTodayOrders();

        long totalProduct = productRepository.count();
        return new SummaryResponse(userOrders.size(), totalRevenue, todayOrders.size(), totalProduct);
    }


    public RevenueByMonthResponse getMonthlyRevenue() {
        List<Object[]> results = orderRepository.getRevenueByMonth();
        Map<Integer, Integer> revenueMap = new HashMap<>();
        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            int revenue = ((Number) row[1]).intValue();
            revenueMap.put(month, revenue);
        }

        RevenueByMonthResponse revenueByMonthResponse = new RevenueByMonthResponse();
        for (int month = 1; month <= 12; month++) {
            revenueByMonthResponse.getLabels().add("T" + month);
            revenueByMonthResponse.getData().add(revenueMap.getOrDefault(month, 0));
        }

        return revenueByMonthResponse;
    }

    public TotalOrderStatus getTotalOrderStatus(List<UserOrder> userOrders){
        TotalOrderStatus totalOrderStatus = new TotalOrderStatus();
        String[] labels = { "Chờ xác nhận", "Đang xử lý", "Đang giao hàng", "Hoàn thành", "Đã hủy" };
        for (String label: labels){
            totalOrderStatus.getLabels().add(label);
            int totalOrder = userOrders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase(label))
                    .toList().size();
            totalOrderStatus.getData().add(totalOrder);
        }
        return totalOrderStatus;
    }

    @Override
    public Map<String, Object> getStatistics() {
        List<UserOrder> userOrders = orderRepository.findAll();
        Map<String, Object> result = new HashMap<>();
        result.put("summary", getSummary(userOrders));
        result.put("revenueByMonth", getMonthlyRevenue());
        result.put("orderStatus", getTotalOrderStatus(userOrders));
        List<ProductStatisticProjection> rawList = productRepository.findTop5BestSellingProducts();
        List<ProductStatisticResponse> productStatisticResponses = rawList.stream()
                .map(p -> new ProductStatisticResponse(p.getName(), p.getSoldQuantity(), p.getRevenue()))
                .toList();
        System.out.println(productStatisticResponses);
        result.put("topProducts", productStatisticResponses);
        return result;
    }
}
