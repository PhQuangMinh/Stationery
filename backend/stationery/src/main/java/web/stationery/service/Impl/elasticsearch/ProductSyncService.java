package web.stationery.service.Impl.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.IndexResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import web.stationery.model.Product;
import web.stationery.model.elasticsearch.BrandDocument;
import web.stationery.model.elasticsearch.CategoryDocument;
import web.stationery.model.elasticsearch.ProductDocument;
import web.stationery.repository.ProductRepository;

import java.io.IOException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductSyncService {

    private final ProductRepository productRepository;
    private final ElasticsearchClient elasticsearchClient;

    @Scheduled(fixedRate = 60000)
    public void syncProductsToElastic() {
        List<Product> updatedProducts = productRepository.findByUpdatedAtAfterAndDeleteFlagFalse(Timestamp.from(Instant.now().minusSeconds(60)));

        for (Product product : updatedProducts) {
            ProductDocument productDoc = convertToProductDocument(product);
            indexProductToElastic(productDoc);
        }
    }

    private ProductDocument convertToProductDocument(Product product) {
        return new ProductDocument(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getCountSales(),
                product.getDiscount(),
                product.getImageUrl(),
                new BrandDocument(product.getBrand().getId(), product.getBrand().getName()),
                product.getCategories() != null
                        ? product.getCategories().stream()
                        .map(category -> new CategoryDocument(category.getId(), category.getName()))
                        .collect(Collectors.toList())
                        : Collections.emptyList(),
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }
    private void indexProductToElastic(ProductDocument productDoc) {
        try {
            IndexResponse response = elasticsearchClient.index(i -> i
                    .index("products")
                    .id(String.valueOf(productDoc.getId()))
                    .document(productDoc)
            );

            System.out.println("Elasticsearch response: " + response.result().name());

        } catch (IOException e) {
            System.err.println("Lỗi khi index sản phẩm " + productDoc.getId() + ": " + e.getMessage());
        }
    }

    @PostConstruct
    public void initSync() {
        syncAllProducts();
    }

    public void syncAllProducts() {
        List<Product> products = productRepository.findByDeleteFlagFalse();
        List<ProductDocument> productDocuments = products.stream()
                .map(this::convertToProductDocument)
                .toList();

        try {

            BulkRequest.Builder br = new BulkRequest.Builder();

            for (ProductDocument doc : productDocuments) {
                br.operations(op -> op
                        .index(idx -> idx
                                .index("products")
                                .id(doc.getId().toString())
                                .document(doc)
                        )
                );
            }

            BulkResponse bulkResponse = elasticsearchClient.bulk(br.build());

            if (bulkResponse.errors()) {
                System.err.println("Lỗi xảy ra khi đồng bộ dữ liệu lên Elasticsearch");
            } else {
                System.out.println("Đồng bộ thành công " + productDocuments.size() + " sản phẩm vào Elasticsearch!");
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.err.println("Lỗi khi đồng bộ dữ liệu: " + e.getMessage());
        }
    }
}
