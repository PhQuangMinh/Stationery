package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
}
