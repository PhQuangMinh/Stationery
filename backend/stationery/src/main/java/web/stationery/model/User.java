package web.stationery.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import web.stationery.common.constant.Role;
import web.stationery.utils.validator.StrongPassword;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@ToString
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "delete_flag", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean deleteFlag = false;

    @Column(name = "create_at", updatable = false)
    @CreationTimestamp
    private Timestamp createAt;

    @Column(name = "update_at")
    @UpdateTimestamp
    private Timestamp updateAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore


    private List<UserOrder> userOrders = new ArrayList<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Cart cart = new Cart();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> sentNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Notification> receivedNotifications = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<VerificationCode> verificationCodes = new ArrayList<>();

}
