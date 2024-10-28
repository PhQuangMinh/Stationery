package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Shipping;
import web.stationery.repository.ShippingRepository;
import web.stationery.service.ShippingService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShippingServiceImpl implements ShippingService{
    private final ShippingRepository shippingRepository;

    @Override
    public Page<Shipping> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return shippingRepository.findAll(pageable);
    }

    @Override
    public Shipping findById(String id) {
        Optional<Shipping> shipping = shippingRepository.findById(id);
        if (shipping.isEmpty()) throw new NotFoundException("Shipping not found - " + id);
        return shipping.get();
    }

    @Override
    public Shipping save(Shipping user) {
        return shippingRepository.save(user);
    }

    @Override
    public void deleteById(String id) {
        Optional<Shipping> shipping = shippingRepository.findById(id);
        if (shipping.isEmpty()) throw new NotFoundException("Shipping not found - " + id);
        shippingRepository.deleteById(id);
    }
}
