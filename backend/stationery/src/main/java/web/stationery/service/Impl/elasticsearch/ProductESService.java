package web.stationery.service.Impl.elasticsearch;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.model.elasticsearch.ProductDocument;
import web.stationery.repository.elasticsearch.ProductElasticRepository;
import web.stationery.dto.response.productresponse.ProductResponse;

@Service
@RequiredArgsConstructor
public class ProductESService {
    private final ProductElasticRepository productElasticRepository;
    private final web.stationery.mapper.ProductDocumentMapper productMapper;

    public Page<ProductResponse> searchProductsByName(String name, Pageable pageable) {
        Page<ProductDocument> productDocuments = productElasticRepository.searchByName(name, pageable);
        return productMapper.toProductResponsePage(productDocuments);
    }
}
