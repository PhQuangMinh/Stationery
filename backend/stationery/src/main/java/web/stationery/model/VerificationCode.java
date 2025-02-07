package web.stationery.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

@Entity
@Table(name = "verification_codes")
@Getter
@Setter
@ToString
@AllArgsConstructor
public class VerificationCode {
    public VerificationCode(){}

    public VerificationCode(User user, String code, Timestamp expiryTime){
        this.user = user;
        this.code = code;
        this.expiryTime = expiryTime;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "expiry_time", nullable = false)
    private Timestamp expiryTime;

    @Column(name = "delete_flag", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean deleteFlag = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
