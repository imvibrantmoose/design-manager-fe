package com.designtemplate.api.repository;

import com.designtemplate.api.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTemplateIdOrderByCreatedAtDesc(String templateId);
}
