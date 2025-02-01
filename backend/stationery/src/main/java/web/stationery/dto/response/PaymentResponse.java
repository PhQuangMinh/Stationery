package web.stationery.dto.response;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PaymentResponse {
    public String code;
    public String message;
    public String paymentUrl;
}
