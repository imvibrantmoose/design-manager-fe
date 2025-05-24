package com.designtemplate.api.repository;

import com.designtemplate.api.model.Template;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface TemplateRepository extends MongoRepository<Template, String>, 
                                          PagingAndSortingRepository<Template, String> {
    List<Template> findByCategory(String category);
    List<Template> findByTitleContainingIgnoreCase(String title);
    List<Template> findByCreatedBy(String userId);
    List<Template> findByBookmarksContaining(String userId);
    boolean existsByCategory(String category);
    long countByCategory(String category);
}
