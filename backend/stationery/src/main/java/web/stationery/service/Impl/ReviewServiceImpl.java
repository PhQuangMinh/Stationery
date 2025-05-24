package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.dto.request.ReviewRequest;
import web.stationery.dto.response.ReviewResponse;
import web.stationery.model.Product;
import web.stationery.model.Review;
import web.stationery.model.User;
import web.stationery.repository.ReviewRepository;
import web.stationery.service.ReviewService;
import web.stationery.utils.mapper.ReviewMapper;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    private final ReviewMapper reviewMapper = new ReviewMapper();

    @Override
    public Page<ReviewResponse> getReviewsByProduct(Product product, int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Page<Review> reviewPage = reviewRepository.findByProduct(product, pageable);
        List<ReviewResponse> reviewResponses = reviewMapper.toResponseList(reviewPage.getContent());
        return new PageImpl<>(reviewResponses, pageable, reviewPage.getTotalElements());
    }

    @Override
    public Page<ReviewResponse> getReviewsByUser(User user, int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Page<Review> reviewPage = reviewRepository.findByUser(user, pageable);
        List<ReviewResponse> reviewResponses = reviewMapper.toResponseList(reviewPage.getContent());
        return new PageImpl<>(reviewResponses);
    }

    @Override
    public ReviewResponse createReview(User user, Product product, ReviewRequest reviewRequest) {
        Review review = reviewMapper.toEntity(reviewRequest, product, user);
        return reviewMapper.toResponse(reviewRepository.save(review));
    }

    @Override
    public ReviewResponse updateReview(User user, Product product, int reviewId, ReviewRequest reviewRequest) {
        Optional<Review> review = reviewRepository.findByUserAndProductAndId(user, product, reviewId);
        if (review.isPresent()) {
            review.get().setComment(reviewRequest.getComment());
            review.get().setRating(reviewRequest.getRating());
            return reviewMapper.toResponse(reviewRepository.save(review.get()));
        }
        throw new NotFoundException("Review not found for user - " + user.getId() + " and product - " + product.getId());
    }

    @Override
    public List<ReviewResponse> getReviewByProductAndUser(User user, Product product) {
        Optional<List<Review>> findReviews = reviewRepository.findByUserAndProduct(user, product);
        if (findReviews.isEmpty()){
            throw new NotFoundException("Reviews not found for user - " + user.getId() + " and product - " + product.getId());
        }
        return reviewMapper.toResponseList(findReviews.get());
    }

    @Override
    public double getAverageRatingByProduct(Product product) {
        return reviewRepository.findAverageRatingByProduct(product);
    }

    @Override
    public int getTotalReviewsByProductId(Product product) {
        return reviewRepository.countByProductAndDeleteFlag(product, false);
    }

    @Override
    public Page<ReviewResponse> getAllReviews(int size, int page, String sortBy) {
        Pageable pageable = PageRequest.of(0, size, Sort.by("id").descending());
        Page<Review> reviewPage = reviewRepository.findAll(pageable);
        List<ReviewResponse> reviewResponses = reviewMapper.toResponseList(reviewPage.getContent());
        return new PageImpl<>(reviewResponses, pageable, reviewPage.getTotalElements());
    }

    @Override
    public void deleteReview(int reviewId) {
        Optional<Review> review = reviewRepository.findById(String.valueOf(reviewId));
        if (review.isEmpty()){
            throw new NotFoundException("Not found review - " + reviewId);
        }
        reviewRepository.delete(review.get());
    }
}
