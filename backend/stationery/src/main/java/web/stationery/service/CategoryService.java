package web.stationery.service;

import org.springframework.data.domain.Page;
import web.stationery.model.Category;

public interface CategoryService {
    Page<Category> findAll(int size, int page, String sortBy);
    Category findById(String id);
    Category save(Category category);
    void deleteById(String id);
}
