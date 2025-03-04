package web.stationery.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import web.stationery.utils.validator.StrongPassword;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegisterUserRequest {
    private String firstName;

    private String lastName;

    private String username;

    @NotBlank(message = "NOT_EMPTY_EMAIL")
    @Email(message = "INVALID_EMAIL")
    private String email;

//    @StrongPassword
    private String password;

    private String address;

    private String phone;
}
