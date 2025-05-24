package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class RabbitMQListenerImpl implements RabbitMQListener {
    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationService notificationService;

    @Override
    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleMessage(NotificationRequest notificationRequest) {
        try {
            log.info(notificationRequest.toString());
            validateNotificationRequest(notificationRequest);
            notificationService.saveNotification(notificationRequest);
            messagingTemplate.convertAndSend(
                "/topic/notifications/",
                notificationRequest
            );
        } catch (Exception e) {
            log.error("Error processing notification: ", e);
        }
    }

    private void validateNotificationRequest(NotificationRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Notification request cannot be null");
        }
    }
}
