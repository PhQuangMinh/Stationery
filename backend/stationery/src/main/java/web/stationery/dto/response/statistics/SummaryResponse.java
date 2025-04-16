package web.stationery.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class SummaryResponse {
    private int totalOrders;
    private long totalRevenue;
    private int todayOrders;
    private long totalProducts;
}
