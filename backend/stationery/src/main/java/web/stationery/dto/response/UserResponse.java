package web.stationery.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {
    private long id;
    private String username;
    private String email;
    private String name;
    private String phone;
    private String address;
    private String role;
    public UserResponse(long id, String name, String phone){
        this.id = id;
        this.name = name;
        this.phone = phone;
    }
}
