package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.IncorrectDataException;
import web.stationery.model.User;
import web.stationery.model.VerificationCode;
import web.stationery.repository.VerificationCodeRepository;
import web.stationery.service.EmailService;
import web.stationery.service.UserService;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final Random random;

    private final VerificationCodeRepository verificationCodeRepository;

    private final UserService userService;

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public String sendVerificationCode(String toEmail) {
        String verificationCode = generateVerificationCode();
        Timestamp expiryTime = Timestamp.from(Instant.now().plusSeconds(300));
        User user = userService.findByEmail(toEmail);
        if (user==null){
            throw new IncorrectDataException("Email not found");
        }
        VerificationCode code = new VerificationCode(user, verificationCode, expiryTime);
        verificationCodeRepository.save(code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Mã Xác Thực");
        message.setText("Mã xác thực của bạn là: " + verificationCode + ". Mã này có hiệu lực trong 5 phút.");

        mailSender.send(message);
        return "Mã xác thực đã gửi đến email!";
    }

    public boolean verifyCode(String username, String code) {
        return verificationCodeRepository.findLatestByUsername(username)
                .filter(vc -> {
                    boolean isValid = vc.getCode().equals(code) && 
                                    vc.getExpiryTime().toInstant().isAfter(LocalDateTime.now()
                                            .atZone(java.time.ZoneId.systemDefault()).toInstant());
                    if (isValid) {
                        vc.setExpiryTime(Timestamp.from(Instant.now()));
                        verificationCodeRepository.save(vc);
                    }
                    return isValid;
                })
                .isPresent();
    }

    public String generateVerificationCode() {
        int code = random.nextInt(900000);
        return String.valueOf(code);
    }
}
