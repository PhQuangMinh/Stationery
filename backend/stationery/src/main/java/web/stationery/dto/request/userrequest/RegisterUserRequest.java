package web.stationery.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RegisterUserRequest {
    private String firstName;

    private String lastName;

//    @Size(min = 3, message = "INVALID_USERNAME")
    private String username;

    @NotBlank(message = "NOT_EMPTY_EMAIL")
    @Email(message = "INVALID_EMAIL")
    private String email;

//    @Size(min = 8, message = "INVALID_PASSWORD")
    private String password;

    private String address;

    private String phone;
}
