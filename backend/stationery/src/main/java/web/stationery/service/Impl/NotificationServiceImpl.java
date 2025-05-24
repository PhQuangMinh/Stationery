package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.dto.request.NotificationRequest;
import web.stationery.dto.response.NotificationResponse;
import web.stationery.model.Notification;
import web.stationery.repository.NotificationRepository;
import web.stationery.service.NotificationService;
import web.stationery.service.UserService;
import web.stationery.utils.mapper.NotificationMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationMapper notificationMapper = new NotificationMapper();

    private final UserService userService;

    @Override
    public Page<NotificationResponse> getNotifications(int size) {
        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Page<Notification> notificationPage = notificationRepository.findAll(pageable);
        List<NotificationResponse> notificationResponseList = notificationMapper.toNotificationResponseList(notificationPage.getContent());
        return new PageImpl<>(notificationResponseList, pageable, notificationPage.getTotalElements());
    }

    @Override
    public int getQuantityUnreadNotifications() {
        return notificationRepository.countByStatus("UNREAD");
    }

    @Override
    public NotificationResponse markReadNotification(String notificationId) {
        Optional<Notification> findNotification = notificationRepository.findById(notificationId);
        if (findNotification.isEmpty()) throw new NotFoundException("Not found notification - " + notificationId);
        findNotification.get().setStatus("READ");
        return notificationMapper.toNotificationResponse(notificationRepository.save(findNotification.get()));
    }

    @Override
    public void deleteNotification(String notificationId) {
        Optional<Notification> findNotification = notificationRepository.findById(notificationId);
        if (findNotification.isEmpty()) throw new NotFoundException("Not found notification - " + notificationId);
        notificationRepository.delete(findNotification.get());
    }

    @Override
    public void saveNotification(NotificationRequest notificationRequest) {
        notificationMapper.toNotificationResponse(notificationRepository.save(
                notificationMapper.toEntity(notificationRequest)));
    }
}
