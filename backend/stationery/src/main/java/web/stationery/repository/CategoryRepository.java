package web.stationery.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Category;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findByName(String name);
    List<Category> findByParentIsNull();
    List<Category> findByParent_Id(Integer parentId);
    List<Category> findByParentIsNullAndDeleteFlagFalse();
    List<Category> findByParent_IdAndDeleteFlagFalse(Integer parentId);
    Page<Category> findByNameContainingIgnoreCaseAndDeleteFlagFalse(String name, Pageable pageable);
    Page<Category> findByDeleteFlagFalse(Pageable pageable);
}
