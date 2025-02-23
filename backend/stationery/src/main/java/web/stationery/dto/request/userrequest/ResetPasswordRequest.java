package web.stationery.dto.request.userrequest;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SecondaryRow;

@Getter
@Setter
public class ResetPasswordRequest {
//    @StrongPassword
    private String newPassword;

    private String confirmPassword;
}
