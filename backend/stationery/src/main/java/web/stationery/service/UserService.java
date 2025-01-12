package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.User;

public interface UserService {
    Page<User> findAll(int size, int page, String sortBy);
    User findById(String id);
    User save(User user);
    void deleteById(String id);
}
