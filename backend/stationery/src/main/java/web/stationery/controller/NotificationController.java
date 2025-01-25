package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.NotificationResponse;
import web.stationery.repository.NotificationRepository;
import web.stationery.service.NotificationService;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final UserService userService;

    private final NotificationService notificationService;

    @PostMapping("/{sender}/{receiver}")
    public CustomResponse<NotificationResponse> sendNotification(@PathVariable String sender, @PathVariable String receiver
            ,@RequestBody NotificationRequest notificationRequest){
        return new CustomResponse<>(notificationService.sendNotification(userService.findUserByUsername(sender)
                , userService.findUserByUsername(receiver), notificationRequest));
    }

    @GetMapping("/{username}/{size}")
    public CustomResponse<Page<NotificationResponse>> getNotification(@PathVariable String username
            , @RequestParam(defaultValue = "10") int size){
        return new CustomResponse<>(notificationService.getNotifications(userService.findUserByUsername(username), size));
    }

    @GetMapping("/{username}/unread")
    public CustomResponse<Integer> getQuantityUnreadNotifications(@PathVariable String username){
        return new CustomResponse<>(notificationService.getQuantityUnreadNotifications(userService.findUserByUsername(username)));
    }

    @PutMapping("/mark-read")
    public CustomResponse<NotificationResponse> markReadNotification(@RequestParam String notificationId){
        return new CustomResponse<>(notificationService.markReadNotification(notificationId));
    }

    @PutMapping("/delete")
    public CustomResponse<NotificationResponse> deleteNotification(@RequestParam String notificationId){
        return new CustomResponse<>(notificationService.deleteNotification(notificationId));
    }
}
