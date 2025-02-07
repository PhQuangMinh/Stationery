package web.stationery.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.response.CustomResponse;
import web.stationery.service.EmailService;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public CustomResponse<?> sendEmail(@RequestParam String toEmail) {
        return new CustomResponse<>(emailService.sendVerificationCode(toEmail), HttpStatus.OK);
    }

    @PostMapping("/verify")
    public CustomResponse<?> verifyCode(@RequestParam String username, @RequestParam String code) {
        boolean isValid = emailService.verifyCode(username, code);
        if (isValid){
            return new CustomResponse<>("Xác thực thành công!", HttpStatus.OK);
        }
        return new CustomResponse<>("Mã xác thực không đúng hoặc đã hết hạn!", HttpStatus.BAD_REQUEST);
    }
}
