package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.model.Category;
import web.stationery.repository.CategoryRepository;
import web.stationery.service.CategoryService;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Page<Category> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        return categoryRepository.findAll(pageable);
    }

    @Override
    public Category findById(String id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) throw new NotFoundException("Category not found - " + id);
        return category.get();
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteById(String id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) throw new NotFoundException("Category not found - " + id);
        categoryRepository.deleteById(id);
    }
}
