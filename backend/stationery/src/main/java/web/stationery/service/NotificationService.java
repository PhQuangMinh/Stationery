package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.NotificationResponse;
import web.stationery.model.User;

public interface NotificationService {
    Page<NotificationResponse> getNotifications(User user, int size);
    int getQuantityUnreadNotifications(User user);
    NotificationResponse markReadNotification(String notificationId);
    NotificationResponse deleteNotification(String notificationId);
    NotificationResponse saveNotification(NotificationRequest notificationRequest);
}
