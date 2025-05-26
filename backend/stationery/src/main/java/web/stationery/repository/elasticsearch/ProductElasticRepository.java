package web.stationery.repository.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import web.stationery.model.Product;
import web.stationery.model.elasticsearch.ProductDocument;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ProductElasticRepository {
    private final ElasticsearchClient elasticsearchClient;

    public Page<ProductDocument> searchByName(String name, Pageable pageable) {
        try {
            SearchResponse<ProductDocument> response = elasticsearchClient.search(s -> s
                            .index("products")
                            .query(q -> q
                                    .queryString(qs -> qs
                                            .fields("name")
                                            .query("*" + name.toLowerCase() + "*")
                                    )
                            )
                            .from((int) pageable.getOffset())
                            .size(pageable.getPageSize()),
                    ProductDocument.class
            );



            List<ProductDocument> products = response.hits().hits().stream()
                    .map(Hit::source)
                    .collect(Collectors.toList());

            assert response.hits().total() != null;
            return new PageImpl<>(products, pageable, response.hits().total().value());

        } catch (IOException e) {
            log.error("Lỗi khi tìm kiếm sản phẩm theo tên: {}", e.getMessage());
            return Page.empty();
        }
    }
}
