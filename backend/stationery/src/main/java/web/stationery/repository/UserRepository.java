package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
}
