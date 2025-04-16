package web.stationery.dto.response.statistics;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StatisticsResponse {
    private SummaryResponse summaryResponse;
    private RevenueByMonthResponse revenueByMonthResponse;
    private TotalOrderStatus totalOrderStatus;
}
