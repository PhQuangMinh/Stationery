package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import web.stationery.configuration.RabbitMQConfig;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.service.NotificationService;
import web.stationery.service.RabbitMQListener;

@Service
@RequiredArgsConstructor
public class RabbitMQListenerImpl implements RabbitMQListener {
    private final Logger logger = LoggerFactory.getLogger(RabbitMQListenerImpl.class);

    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationService notificationService;

    @Override
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleMessage(NotificationRequest notificationRequest) {
        try {
            validateNotificationRequest(notificationRequest);
            notificationService.saveNotification(notificationRequest);
            messagingTemplate.convertAndSend(
                "/topic/notifications/" + notificationRequest.getUsernameReceiver(), 
                notificationRequest
            );
        } catch (Exception e) {
            logger.error("Error processing notification: ", e);
            // Có thể thêm dead letter queue để xử lý message lỗi
        }
    }

    private void validateNotificationRequest(NotificationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Notification request cannot be null");
        }
        if (request.getUsernameReceiver() == null) {
            logger.warn("Username receiver is null, notification might not be delivered correctly");
        }
    }
}
