package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import web.stationery.configuration.RabbitMQConfig;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.NotificationResponse;
import web.stationery.service.NotificationService;
import web.stationery.service.UserService;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@RequiredArgsConstructor
@RestController
@Slf4j
public class NotificationController {
    private final UserService userService;

    private final NotificationService notificationService;

    private final RabbitTemplate rabbitTemplate;

    @CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5500"}, allowCredentials = "true")
    @MessageMapping("/send")
    public void sendNotification(@Payload NotificationRequest notification) {
        try {
            log.info("Received notification: {}", notification);
            validateNotification(notification);
            notificationService.saveNotification(notification);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY, notification);
        } catch (Exception e) {
            log.error("Error sending notification: ", e);
            throw new RuntimeException("Failed to send notification", e);
        }
    }



    private void validateNotification(NotificationRequest notification) {
        if (notification == null) {
            throw new IllegalArgumentException("Invalid notification data");
        }
    }

    @PostMapping("/user/notifications/send")
    public void saveNotification(@RequestBody NotificationRequest notification) {
        try {
            validateNotification(notification);
            notificationService.saveNotification(notification);
        } catch (Exception e) {
            log.error("Error sending notification: ", e);
            throw new RuntimeException("Failed to send notification", e);
        }
    }

    @GetMapping("/admin/notifications/{size}")
    public CustomResponse<Page<NotificationResponse>> getNotification(@RequestParam(defaultValue = "10") String size){
        return new CustomResponse<>(notificationService.getNotifications(Integer.parseInt(size)));
    }

    @GetMapping("/admin/notifications/unread")
    public CustomResponse<Integer> getQuantityUnreadNotifications(){
        return new CustomResponse<>(notificationService.getQuantityUnreadNotifications());
    }

    @PutMapping("/admin/notifications/mark-read")
    public CustomResponse<NotificationResponse> markReadNotification(@RequestParam String notificationId){
        return new CustomResponse<>(notificationService.markReadNotification(notificationId));
    }

    @PutMapping("/admin/notifications/delete")
    public CustomResponse<?> deleteNotification(@RequestParam String notificationId){
        return new CustomResponse<>("Delete successful");
    }
}
