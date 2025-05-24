package com.designtemplate.api.service;

import com.designtemplate.api.dto.CategoryDto;
import com.designtemplate.api.model.Category;
import com.designtemplate.api.repository.CategoryRepository;
import com.designtemplate.api.repository.TemplateRepository;
import com.designtemplate.api.exception.ResourceNotFoundException;
import com.designtemplate.api.exception.InvalidOperationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final TemplateRepository templateRepository;

    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryDto createCategory(CategoryDto categoryDto) {
        if (categoryRepository.existsByName(categoryDto.getName())) {
            throw new IllegalArgumentException("Category with this name already exists");
        }

        Category category = Category.builder()
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .createdBy(getCurrentUserId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return convertToDto(savedCategory);
    }

    public void deleteCategory(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        // Check if category is in use
        if (templateRepository.existsByCategory(category.getName())) {
            throw new InvalidOperationException("Cannot delete category that is being used by templates");
        }

        categoryRepository.deleteById(id);
    }

    public long getCategoryUsageCount(String categoryName) {
        return templateRepository.countByCategory(categoryName);
    }

    private String getCurrentUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private CategoryDto convertToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdBy(category.getCreatedBy())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
