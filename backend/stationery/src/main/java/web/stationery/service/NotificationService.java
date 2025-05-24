package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.NotificationResponse;

public interface NotificationService {
    Page<NotificationResponse> getNotifications(int size);
    int getQuantityUnreadNotifications();
    NotificationResponse markReadNotification(String notificationId);
    void deleteNotification(String notificationId);
    void saveNotification(NotificationRequest notificationRequest);
}
