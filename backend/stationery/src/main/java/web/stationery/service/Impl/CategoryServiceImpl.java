package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.categoryrequest.CategoryRequest;
import web.stationery.dto.response.CategoryResponse;
import web.stationery.model.Category;
import web.stationery.repository.CategoryRepository;
import web.stationery.service.CategoryService;
import web.stationery.utils.mapper.CategoryMapper;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    private final CategoryMapper categoryMapper;

    @Override
    public Page<CategoryResponse> findAll(int size, int page, String sortBy) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Category> categoriesPage = categoryRepository.findAll(pageable);
        List<CategoryResponse> categoryResponses = categoryMapper.toResponseList(categoriesPage.getContent());
        return new PageImpl<>(categoryResponses, pageable, categoriesPage.getTotalElements());
    }

    @Override
    public CategoryResponse findByName(String name) {
        Optional<Category> findCategory = categoryRepository.findByName(name);
        if (findCategory.isEmpty()) throw new NotFoundException("Category not found - " + name);
        return categoryMapper.toResponse(findCategory.get());
    }

    @Override
    public CategoryResponse save(CategoryRequest categoryRequest) {
        Category category = categoryMapper.toEntity(categoryRequest);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse deleteByName(String name) {
        Optional<Category> findCategory = categoryRepository.findByName(name);
        if (findCategory.isEmpty()) throw new NotFoundException("Category not found - " + name);
        findCategory.get().setDeleteFlag(true);
        return categoryMapper.toResponse(findCategory.get());
    }

    @Override
    public Page<CategoryResponse> findAllByName(int size, int page, String sortBy, String name) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Category> categories = categoryRepository.findByNameContainingIgnoreCase(name, pageable);
        List<CategoryResponse> categoryResponses = categoryMapper.toResponseList(categories.getContent());
        return new PageImpl<>(categoryResponses, pageable, categories.getTotalElements());
    }
}
