package web.stationery.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {
    @Email(message = "Email không đúng định dạng")
    private String email;
}
