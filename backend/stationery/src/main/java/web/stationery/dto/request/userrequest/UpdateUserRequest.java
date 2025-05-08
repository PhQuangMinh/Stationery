package web.stationery.dto.request.userrequest;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String name;

    @NotBlank(message = "NOT_EMPTY_EMAIL")
    @Email(message = "INVALID_EMAIL")
    private String email;

    private String phone;

    private String address;
}
