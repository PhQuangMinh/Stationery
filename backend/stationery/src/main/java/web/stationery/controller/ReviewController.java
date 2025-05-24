package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import web.stationery.dto.request.ReviewRequest;
import web.stationery.dto.response.CustomResponse;
import web.stationery.dto.response.ReviewResponse;
import web.stationery.service.ProductService;
import web.stationery.service.ReviewService;
import web.stationery.service.UserService;

@RequiredArgsConstructor
@RestController
public class ReviewController {
    private final ReviewService reviewService;

    private final ProductService productService;

    private final UserService userService;

    @GetMapping("/reviews/product/{productId}")
    public CustomResponse<?> getReviewByProduct(@PathVariable String productId,
                                                @RequestParam(defaultValue = "10") int size,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(reviewService.getReviewsByProduct(productService.findProductById(productId), size, page, sortBy));
    }

    @GetMapping("/admin/reviews/user/{username}")
    public CustomResponse<?> getReviewsByUser(@PathVariable String username,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(reviewService.getReviewsByUser(userService.findUserByUsername(username), size, page, sortBy));
    }

    @GetMapping("/admin/reviews/get-all")
    public CustomResponse<?> getReviewByProduct(@RequestParam(defaultValue = "10") int size,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(reviewService.getAllReviews(size, page, sortBy));
    }

    @PostMapping("/user/reviews/{productId}/{username}/create")
    public CustomResponse<?> createReview(@PathVariable String username, @PathVariable String productId, @RequestBody ReviewRequest reviewRequest) {
        return new CustomResponse<>(reviewService.createReview(userService.findUserByUsername(username), productService.findProductById(productId), reviewRequest));
    }

    @PutMapping("/user/reviews/{username}/{productId}/{reviewId}/update")
    public CustomResponse<?> updateReview(@PathVariable String username, @PathVariable String reviewId,
            @PathVariable String productId, @RequestBody ReviewRequest reviewRequest) {
        return new CustomResponse<>(reviewService.updateReview(userService.findUserByUsername(username),
                productService.findProductById(productId), Integer.parseInt(reviewId), reviewRequest));
    }

    @GetMapping("/reviews/{username}/{productId}/delete")
    public CustomResponse<?> getReviewByUserAndProduct(@PathVariable String username, @PathVariable String productId){
        return new CustomResponse<>(reviewService.getReviewByProductAndUser(userService.findUserByUsername(username)
               , productService.findProductById(productId)));
    }

    @GetMapping("/reviews/{productId}/average-rating")
    public CustomResponse<?> getAverageRatingByProduct(@PathVariable String productId){
        return new CustomResponse<>(reviewService.getAverageRatingByProduct(productService.findProductById(productId)));
    }

    @GetMapping("/reviews/{productId}/total-review")
    public CustomResponse<?> getTotalReviewsByProduct(@PathVariable String productId){
        return new CustomResponse<>(reviewService.getTotalReviewsByProductId(productService.findProductById(productId)));
    }

    @DeleteMapping("/admin/reviews/delete/{reviewId}")
    public void deleteReview(@PathVariable int reviewId){
        reviewService.deleteReview(reviewId);
    }
}
