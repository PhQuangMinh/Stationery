package web.stationery.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NotificationRequest {
    private String message;
    private String status;
    private String link;
    private String type;
    private String usernameReceiver;
}
