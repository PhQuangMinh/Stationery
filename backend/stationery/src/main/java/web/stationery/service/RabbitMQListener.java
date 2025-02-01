package web.stationery.service;

import web.stationery.dto.request.NotificationRequest;

public interface RabbitMQListener {
    void handleMessage(NotificationRequest notificationRequest);
}
