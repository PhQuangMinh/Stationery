package web.stationery.utils.mapper;

import web.stationery.common.constant.TypeNotification;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.NotificationResponse;
import web.stationery.model.Notification;
import web.stationery.model.User;

import java.util.ArrayList;
import java.util.List;

public class NotificationMapper {
    public List<NotificationResponse> toNotificationResponseList(List<Notification> notifications){
        List<NotificationResponse> notificationResponses = new ArrayList<>();
        for(Notification notification : notifications){
            notificationResponses.add(toNotificationResponse(notification));
        }
        return notificationResponses;
    }

    public NotificationResponse toNotificationResponse(Notification notification){
        return new NotificationResponse(
                String.valueOf(notification.getId()),
                notification.getMessage(),
                notification.getStatus(),
                notification.getLink(),
                notification.getType()
        );
    }

    public Notification toEntity(NotificationRequest notificationRequest){
        Notification notification = new Notification();
        notification.setMessage(notificationRequest.getMessage());
        notification.setStatus(notificationRequest.getStatus());
        notification.setLink(notificationRequest.getLink());
        notification.setType(notificationRequest.getType());
        return notification;
    }
}
