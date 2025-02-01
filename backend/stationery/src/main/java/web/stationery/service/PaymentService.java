package web.stationery.service;

import jakarta.servlet.http.HttpServletRequest;
import web.stationery.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createVNPayPayment(HttpServletRequest httpServletRequest);
}
