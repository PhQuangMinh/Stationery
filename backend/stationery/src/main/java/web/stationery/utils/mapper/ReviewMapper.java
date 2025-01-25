package web.stationery.utils.mapper;

import web.stationery.dto.request.ReviewRequest;
import web.stationery.dto.response.ReviewResponse;
import web.stationery.model.Product;
import web.stationery.model.Review;
import web.stationery.model.User;

import java.util.ArrayList;
import java.util.List;

public class ReviewMapper {
    public List<ReviewResponse> toResponseList(List<Review> reviewList){
        List<ReviewResponse> reviewResponses = new ArrayList<>();
        for (Review review:reviewList){
            reviewResponses.add(toResponse(review));
        }
        return reviewResponses;
    }

    public ReviewResponse toResponse(Review review){
        return new ReviewResponse(
                review.getId(),
                review.getComment(),
                review.getRating(),
                review.getCreateAt()
        );
    }

    public Review toEntity(ReviewRequest reviewRequest, Product product, User user){
        Review review = new Review();
        review.setComment(reviewRequest.getComment());
        review.setRating(reviewRequest.getRating());
        review.setProduct(product);
        review.setUser(user);
        return review;
    }
}
