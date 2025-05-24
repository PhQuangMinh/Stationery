package web.stationery.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.OrderService;
import web.stationery.service.PaymentService;

import java.io.IOException;

@RestController
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    private final OrderService orderService;


    @GetMapping("/vn-pay")
    public CustomResponse<?> getPayment(HttpServletRequest request){
        return new CustomResponse<>(paymentService.createVNPayPayment(request), "success");
    }

    @GetMapping("/vn-pay-callback")
    public void vnPayCallback(
            @RequestParam("vnp_ResponseCode") String responseCode, HttpServletResponse response,
            @RequestParam("vnp_TxnRef") String txnRef
    ) throws IOException {
        orderService.updateOrderAfterPayment(txnRef, responseCode);
        response.sendRedirect("http://localhost:3000/orders");
    }
}
