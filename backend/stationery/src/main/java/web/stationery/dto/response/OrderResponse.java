package web.stationery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private String id;
    private Timestamp orderDate;
    private long totalAmount;
    private String status;
    private String addressShipping;
    private List<OrderItemResponse> orderItemResponses = new ArrayList<>();
}
