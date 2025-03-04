package web.stationery.dto.request.userrequest;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserAdminRequest extends UpdateUserRequest {
    private String role;
} 