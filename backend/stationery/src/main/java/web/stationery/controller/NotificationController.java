package web.stationery.controller;

import lombok.RequiredArgsConstructor;
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
public class NotificationController {
    private final UserService userService;

    private final NotificationService notificationService;

    private final RabbitTemplate rabbitTemplate;

    @MessageMapping("/send")
    public void sendNotification(@Payload NotificationRequest notification){
        System.out.println("Received message: " + notification);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, notification);
    }

//    @PostMapping("/notifications/{sender}/{receiver}")
//    public CustomResponse<NotificationResponse> sendNotification(@PathVariable String sender, @PathVariable String receiver
//            ,@RequestBody NotificationRequest notificationRequest){
//        return new CustomResponse<>(notificationService.sendNotification( notificationRequest));
//    }

    @GetMapping("/notifications/{username}/{size}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public CustomResponse<Page<NotificationResponse>> getNotification(@PathVariable String username
            , @RequestParam(defaultValue = "10") int size){
        return new CustomResponse<>(notificationService.getNotifications(userService.findUserByUsername(username), size));
    }

    @GetMapping("/notifications/{username}/unread")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public CustomResponse<Integer> getQuantityUnreadNotifications(@PathVariable String username){
        return new CustomResponse<>(notificationService.getQuantityUnreadNotifications(userService.findUserByUsername(username)));
    }

    @PutMapping("/notifications/mark-read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public CustomResponse<NotificationResponse> markReadNotification(@RequestParam String notificationId){
        return new CustomResponse<>(notificationService.markReadNotification(notificationId));
    }

    @PutMapping("/notifications/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public CustomResponse<NotificationResponse> deleteNotification(@RequestParam String notificationId){
        return new CustomResponse<>(notificationService.deleteNotification(notificationId));
    }
}
