package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Payment;

public interface PaymentService {
    Page<Payment> findAll(int size, int page, String sortBy);
    Payment findById(String id);
    Payment save(Payment payment);
    void deleteById(String id);
}
