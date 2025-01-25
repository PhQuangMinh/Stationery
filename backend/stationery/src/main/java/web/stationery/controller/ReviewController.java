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
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    private final ProductService productService;

    private final UserService userService;

    @GetMapping("/product/{productId}")
    public CustomResponse<?> getReviewByProduct(@PathVariable String productId,
                                                @RequestParam(defaultValue = "10") int size,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(reviewService.getReviewsByProduct(productService.findProductById(productId), size, page, sortBy));
    }

    @GetMapping("/user/{username}")
    public CustomResponse<?> getReviewsByUser(@PathVariable String username,
                                              @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(defaultValue = "0") int page,
                                              @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(reviewService.getReviewsByUser(userService.findUserByUsername(username), size, page, sortBy));
    }

    @PostMapping("/{productId}/{username}/create")
    public CustomResponse<?> createReview(@PathVariable String username, @PathVariable String productId, @RequestBody ReviewRequest reviewRequest) {
        return new CustomResponse<>(reviewService.createReview(userService.findUserByUsername(username), productService.findProductById(productId), reviewRequest));
    }

    @PutMapping("/{username}/{productId}/{reviewId}/update")
    public CustomResponse<?> updateReview(@PathVariable String username, @PathVariable String reviewId,
            @PathVariable String productId, @RequestBody ReviewRequest reviewRequest) {
        return new CustomResponse<>(reviewService.updateReview(userService.findUserByUsername(username),
                productService.findProductById(productId), Integer.parseInt(reviewId), reviewRequest));
    }

    @PutMapping("/delete")
    public CustomResponse<?> deleteReview(@PathVariable String reviewId) {
        return new CustomResponse<>(reviewService.deleteReview(reviewId));
    }

    @GetMapping("/{username}/{productId}/delete")
    public CustomResponse<?> getReviewByUserAndProduct(@PathVariable String username, @PathVariable String productId){
        return new CustomResponse<>(reviewService.getReviewByProductAndUser(userService.findUserByUsername(username)
               , productService.findProductById(productId)));
    }

    @GetMapping("/{productId}/average-rating")
    public CustomResponse<?> getAverageRatingByProduct(@PathVariable String productId){
        return new CustomResponse<>(reviewService.getAverageRatingByProduct(productService.findProductById(productId)));
    }

    @GetMapping("/{productId}/total-review")
    public CustomResponse<?> getTotalReviewsByProduct(@PathVariable String productId){
        return new CustomResponse<>(reviewService.getTotalReviewsByProductId(productService.findProductById(productId)));
    }
}
