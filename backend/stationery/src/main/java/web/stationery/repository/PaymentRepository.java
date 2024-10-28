package web.stationery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web.stationery.model.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
}
