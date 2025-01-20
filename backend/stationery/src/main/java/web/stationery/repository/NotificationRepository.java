package web.stationery.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Notification;
import web.stationery.model.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    Page<Notification> findByReceiverEquals(User receiver, Pageable pageable);
    int countByStatusAndDeleteFlagAndReceiver(String status, boolean deleteFlag, User receiver);
}
