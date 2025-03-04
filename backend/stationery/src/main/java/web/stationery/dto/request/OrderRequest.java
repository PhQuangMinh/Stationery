package web.stationery.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private Timestamp orderDate;
    private long totalAmount;
    private String status;
    private String shippingAddress;
    private List<OrderItemRequest> orderItemRequests;
}
