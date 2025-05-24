package web.stationery.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationRequest {
    private String message;
    private String status;
    private String link;
    private String type;
    private String usernameSender;

    @Override
    public String toString(){
        return message + " " + status + " " + link + " " + type + " " + usernameSender;
    }
}
