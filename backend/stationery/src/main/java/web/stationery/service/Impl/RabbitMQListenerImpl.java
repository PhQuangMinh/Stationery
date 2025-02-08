package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import web.stationery.configuration.RabbitMQConfig;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.service.NotificationService;
import web.stationery.service.RabbitMQListener;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RabbitMQListenerImpl implements RabbitMQListener {
    private final SimpMessagingTemplate messagingTemplate;

    private final NotificationService notificationService;

    @Override
    @RabbitListener(queues= RabbitMQConfig.QUEUE_NAME, containerFactory = "rabbitListenerContainerFactory")
    public void handleMessage(NotificationRequest notificationRequest) {
        if (notificationRequest.getUsernameReceiver()==null){
            notificationRequest.setUsernameReceiver("minh");
        }
        notificationService.saveNotification(notificationRequest);
    }
}
