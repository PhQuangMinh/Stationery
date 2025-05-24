package web.stationery.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrderRequest {
    private long totalAmount;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private String txnRef;
    private List<OrderItemRequest> orderItemRequests;
}
