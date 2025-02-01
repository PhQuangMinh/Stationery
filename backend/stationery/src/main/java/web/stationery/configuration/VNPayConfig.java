package web.stationery.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import web.stationery.utils.VNPayUtil;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@Configuration
@Getter
public class VNPayConfig {
    @Value("${payment.url}")
    private String vnpUrl;

    @Value("${payment.tmnCode}")
    private String tmnCode;

    @Value(("${payment.secretKey}"))
    private String secretKey;

    @Value("${payment.returnUrl}")
    private String returnUrl;

    @Value("${payment.version}")
    private String version;

    @Value("${payment.command}")
    private String command;

    @Value("${payment.orderType}")
    private String orderType;

    public Map<String, String> getVNPayConfig() {
        String txnRef = VNPayUtil.getRandomNumber(8);
        Map<String, String> config = new HashMap<>();
        config.put("vnp_Version", this.version);
        config.put("vnp_Command", this.command);
        config.put("vnp_TmnCode", this.tmnCode);
        config.put("vnp_CurrCode", "VND");
        config.put("vnp_TxnRef",  txnRef);
        config.put("vnp_OrderInfo", "Thanh toan don hang:" +  txnRef);
        config.put("vnp_OrderType", this.orderType);
        config.put("vnp_Locale", "vn");
        config.put("vnp_ReturnUrl", this.returnUrl);
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(calendar.getTime());
        config.put("vnp_CreateDate", vnpCreateDate);
        calendar.add(Calendar.MINUTE, 5);
        String vnp_ExpireDate = formatter.format(calendar.getTime());
        config.put("vnp_ExpireDate", vnp_ExpireDate);
        return config;

    }
}
