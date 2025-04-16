package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.StatisticsService;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
public class StatisticsController {
    private final StatisticsService statisticsService;

    @GetMapping()
    public CustomResponse<?> getStatistics() {
        return new CustomResponse<>(statisticsService.getStatistics());
    }

//    @GetMapping("/revenue")
//    public ResponseEntity<?> getRevenue(
//            @RequestParam String timeRange,  // daily, weekly, monthly, yearly
//            @RequestParam String startDate,
//            @RequestParam String endDate
//    ) {
//        // Trả về dữ liệu doanh thu theo thời gian
//    }
//
//    @GetMapping("/order-status")
//    public ResponseEntity<?> getOrderStatusStats() {
//        // Trả về thống kê trạng thái đơn hàng
//    }
//
//    @GetMapping("/top-products")
//    public ResponseEntity<?> getTopProducts(
//        @RequestParam int limit
//    ) {
//        // Trả về top sản phẩm bán chạy
//    }
}