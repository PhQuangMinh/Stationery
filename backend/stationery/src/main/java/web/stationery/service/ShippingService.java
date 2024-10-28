package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Shipping;

public interface ShippingService {
    Page<Shipping> findAll(int size, int page, String sortBy);
    Shipping findById(String id);
    Shipping save(Shipping user);
    void deleteById(String id);
}
