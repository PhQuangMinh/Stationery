package web.stationery.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.PaymentResponse;
import web.stationery.service.PaymentService;

@RestController
@RequestMapping("${spring.application.api-prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/vn-pay")
    public CustomResponse<?> getPayment(HttpServletRequest request){
        return new CustomResponse<>(paymentService.createVNPayPayment(request), "success");
    }

    @GetMapping("/vn-pay-callback")
    public CustomResponse<?> callbackVNPayPayment(HttpServletRequest request){
        String status = request.getParameter("vnp_ResponseCode");
        if ("00".equals(status)) {
            return new CustomResponse<>(new PaymentResponse("00", "Success", ""), "success");
        }
        return new CustomResponse<>("failed");
    }
}
