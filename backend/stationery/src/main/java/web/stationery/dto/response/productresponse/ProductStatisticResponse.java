package web.stationery.dto.response.productresponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductStatisticResponse {
    private String name;
    private int soldQuantity;
    private long revenue;
}