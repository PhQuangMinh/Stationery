package web.stationery.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import web.stationery.common.exception.NotFoundException;
import web.stationery.common.utils.PageableUtils;
import web.stationery.dto.request.categoryrequest.AdminCategoryRequest;
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
        Page<Category> categories = categoryRepository.findAll(pageable);
        List<CategoryResponse> categoryResponses = categoryMapper.toResponseList(categories.getContent());
        return new PageImpl<>(categoryResponses, pageable, categories.getTotalElements());
    }

    @Override
    public Page<CategoryResponse> findAllByName(int size, int page, String sortBy, String name) {
        Pageable pageable = PageableUtils.createPageable(size, page, sortBy);
        Page<Category> categories = categoryRepository.findByNameContainingIgnoreCase(name, pageable);
        List<CategoryResponse> categoryResponses = categoryMapper.toResponseList(categories.getContent());
        return new PageImpl<>(categoryResponses, pageable, categories.getTotalElements());
    }

    @Override
    public CategoryResponse findById(Integer id) {
        Category category = findCategoryById(id);
        return categoryMapper.toResponse(category);
    }

    @Override
    public List<CategoryResponse> getCategoriesTree() {
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        return buildCategoryTree(rootCategories);
    }

    private List<CategoryResponse> buildCategoryTree(List<Category> categories) {
        return categories.stream().map(category -> {
            CategoryResponse response = categoryMapper.toResponse(category);
            List<Category> children = categoryRepository.findByParent_Id(category.getId());
            if (!children.isEmpty()) {
                response.setChildren(buildCategoryTree(children));
            }
            return response;
        }).toList();
    }

    @Override
    public List<CategoryResponse> findAllFull() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toResponseList(categories);
    }

    @Override
    public Category findCategoryById(Integer id) {
        Optional<Category> category = categoryRepository.findById(String.valueOf(id));
        if (category.isEmpty()) throw new NotFoundException("Category not found - " + id);
        return category.get();
    }

    @Override
    public CategoryResponse save(CategoryRequest categoryRequest) {
        Category category = categoryMapper.toEntity(categoryRequest);
        if (categoryRequest.getParentId() != null) {
            Category parent = findCategoryById(categoryRequest.getParentId());
            category.setParent(parent);
        }
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    public Category saveAdmin(AdminCategoryRequest categoryRequest) {
        Category category = categoryMapper.toEntity(categoryRequest);
        if (categoryRequest.getParentId() != null) {
            Category parent = findCategoryById(categoryRequest.getParentId());
            category.setParent(parent);
        }
        category.setDeleteFlag(categoryRequest.isDeleteFlag());
        return categoryRepository.save(category);
    }

    @Override
    public CategoryResponse update(Integer id, CategoryRequest categoryRequest) {
        Category existingCategory = findCategoryById(id);
        categoryMapper.updateCategory(existingCategory, categoryRequest);
        if (categoryRequest.getParentId() != null) {
            Category parent = findCategoryById(categoryRequest.getParentId());
            existingCategory.setParent(parent);
        }
        return categoryMapper.toResponse(categoryRepository.save(existingCategory));
    }

    @Override
    public Category updateAdmin(Integer id, AdminCategoryRequest categoryRequest) {
        Category existingCategory = findCategoryById(id);
        categoryMapper.updateCategory(existingCategory, categoryRequest);
        if (categoryRequest.getParentId() != null) {
            Category parent = findCategoryById(categoryRequest.getParentId());
            existingCategory.setParent(parent);
        }
        existingCategory.setDeleteFlag(categoryRequest.isDeleteFlag());
        return categoryRepository.save(existingCategory);
    }

    @Override
    public CategoryResponse deleteById(Integer id) {
        Category category = findCategoryById(id);
        category.setDeleteFlag(true);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}
