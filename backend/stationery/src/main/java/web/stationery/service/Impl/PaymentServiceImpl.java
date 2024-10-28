package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Payment;
import web.stationery.repository.PaymentRepository;
import web.stationery.service.PaymentService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    @Override
    public Page<Payment> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return paymentRepository.findAll(pageable);
    }

    @Override
    public Payment findById(String id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isEmpty()) throw new NotFoundException("Payment not found - " + id);
        return payment.get();
    }

    @Override
    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public void deleteById(String id) {
        Optional<Payment> payment = paymentRepository.findById(id);
        if (payment.isEmpty()) throw new NotFoundException("Payment not found - " + id);
        paymentRepository.deleteById(id);
    }
}
