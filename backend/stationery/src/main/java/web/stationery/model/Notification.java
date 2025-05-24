package web.stationery.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import web.stationery.common.constant.TypeNotification;

import java.sql.Timestamp;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@ToString
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "link")
    private String link;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Timestamp createdAt;

    @Column(name = "read_at", updatable = false)
    private Timestamp readAt;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
}
