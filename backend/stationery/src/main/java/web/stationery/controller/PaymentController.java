package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Payment;
import web.stationery.service.PaymentService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping()
    public Payment createPayment(@RequestBody Payment payment) {
        return paymentService.save(payment);
    }

    @GetMapping("/{id}")
    public CustomResponse<Payment> findById(@PathVariable int id){
        return new CustomResponse<>(paymentService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Payment>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(paymentService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Payment> updatePayment(@RequestBody Payment payment){
        return new CustomResponse<>(paymentService.save(payment));
    }

    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable String id){
        paymentService.deleteById(id);
    }
}
