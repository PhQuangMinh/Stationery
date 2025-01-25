package web.stationery.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Product;
import web.stationery.model.Review;
import web.stationery.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    Page<Review> findByProduct(Product product, Pageable pageable);
    Page<Review> findByUser(User user, Pageable pageable);
    Optional<Review> findByUserAndProductAndId(User user, Product product, int id);
    Optional<List<Review>> findByUserAndProduct(User user, Product product);
    double findAverageRatingByProduct(Product product);
    int countByProductAndDeleteFlag(Product product, boolean deleteFlag);
}
