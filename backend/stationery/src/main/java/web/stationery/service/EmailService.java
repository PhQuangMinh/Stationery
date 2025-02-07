package web.stationery.service;

public interface EmailService {
    String sendVerificationCode(String toEmail);
    boolean verifyCode(String username, String code);
}
