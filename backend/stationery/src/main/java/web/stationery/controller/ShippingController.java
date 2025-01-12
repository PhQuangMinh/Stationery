package web.stationery.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import web.stationery.common.dto.CustomResponse;
import web.stationery.model.Shipping;
import web.stationery.service.ShippingService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/v1/shippings")
public class ShippingController {
    private final ShippingService shippingService;

    @PostMapping()
    public Shipping createShipping(@RequestBody Shipping shipping) {
        return shippingService.save(shipping);
    }

    @GetMapping("/{id}")
    public CustomResponse<Shipping> findById(@PathVariable int id){
        return new CustomResponse<>(shippingService.findById(String.valueOf(id)));
    }

    @GetMapping()
    public CustomResponse<Page<Shipping>> findAll(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "id") String sortBy) {
        return new CustomResponse<>(shippingService.findAll(size, page, sortBy));
    }

    @PutMapping("/{id}")
    public CustomResponse<Shipping> updateShipping(@RequestBody Shipping shipping){
        return new CustomResponse<>(shippingService.save(shipping));
    }

    @DeleteMapping("/{id}")
    public void deleteShipping(@PathVariable String id){
        shippingService.deleteById(id);
    }
}
