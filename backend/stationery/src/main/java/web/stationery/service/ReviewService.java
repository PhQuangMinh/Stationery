package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.dto.request.ReviewRequest;
import web.stationery.dto.response.ReviewResponse;
import web.stationery.model.Product;
import web.stationery.model.Review;
import web.stationery.model.User;

import java.util.List;

public interface ReviewService {
    Page<ReviewResponse> getReviewsByProduct(Product product, int size, int page, String sortBy);
    Page<ReviewResponse> getReviewsByUser(User user, int size, int page, String sortBy);
    ReviewResponse createReview(User user, Product product, ReviewRequest reviewRequest);
    ReviewResponse updateReview(User user, Product product, int reviewId, ReviewRequest reviewRequest);
    List<ReviewResponse> getReviewByProductAndUser(User user, Product product);
    double getAverageRatingByProduct(Product product);
    int getTotalReviewsByProductId(Product product);
    Page<ReviewResponse> getAllReviews(int size, int page, String sortBy);
    void deleteReview(int reviewId);
}
