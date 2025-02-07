package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web.stationery.model.VerificationCode;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {
    @Query("SELECT vc FROM VerificationCode vc " +
            "JOIN vc.user u " +
            "WHERE u.username = :username " +
            "ORDER BY vc.expiryTime DESC LIMIT 1")
    Optional<VerificationCode> findLatestByUsername(@Param("username") String username);

}
