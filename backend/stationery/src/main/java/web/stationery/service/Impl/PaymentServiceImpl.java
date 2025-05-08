package web.stationery.service.Impl;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import web.stationery.configuration.VNPayConfig;
import web.stationery.dto.response.PaymentResponse;
import web.stationery.service.PaymentService;
import web.stationery.utils.VNPayUtil;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final VNPayConfig vnPayConfig;

    @Override
    public PaymentResponse createVNPayPayment(HttpServletRequest request) {
        String txnRef = UUID.randomUUID().toString().replace("-", "").substring(0, 20);
        Map<String, String> params = vnPayConfig.getVNPayConfig(txnRef);
//        Map<String, String> params = vnPayConfig.getVNPayConfig(request.getParameter("txnRef"));
        params.put("vnp_Amount", String.valueOf(Integer.parseInt(request.getParameter("amount")) * 100L));
        if (request.getParameter("bankCode") != null && !request.getParameter("bankCode").isEmpty()) {
            params.put("vnp_BankCode", request.getParameter("bankCode"));
        }
        params.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));
        String queryUrl = VNPayUtil.getPaymentURL(params, true);
        String hashData = VNPayUtil.getPaymentURL(params, false);
        String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getSecretKey(), hashData);
        queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
        String paymentUrl = vnPayConfig.getVnpUrl() + "?" + queryUrl;
        return new PaymentResponse("ok", "success", paymentUrl);
    }
}
