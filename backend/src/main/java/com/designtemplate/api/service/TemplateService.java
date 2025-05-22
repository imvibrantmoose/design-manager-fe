package com.designtemplate.api.service;

import com.designtemplate.api.dto.TemplateDto;
import com.designtemplate.api.exception.ResourceNotFoundException;
import com.designtemplate.api.model.Template;
import com.designtemplate.api.repository.TemplateRepository;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.designtemplate.api.dto.CommentDto;
import com.designtemplate.api.model.Comment;
import com.designtemplate.api.repository.CommentRepository;

@Slf4j
@Service
@RequiredArgsConstructor
public class TemplateService {
    private final TemplateRepository templateRepository;
    private final CommentRepository commentRepository;

    public Page<TemplateDto> getAllTemplates(Pageable pageable) {
        return templateRepository.findAll(pageable)
                .map(this::convertToDto);
    }

    public List<TemplateDto> getAllTemplates() {
        return templateRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TemplateDto getTemplateById(String id) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return convertToDto(template);
    }

    public List<TemplateDto> getTemplatesByCategory(String category) {
        return templateRepository.findByCategory(category).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TemplateDto> searchTemplates(String query) {
        return templateRepository.findByTitleContainingIgnoreCase(query).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TemplateDto createTemplate(TemplateDto templateDto, String userId) {
        Template template = Template.builder()
                .title(templateDto.getTitle())
                .category(templateDto.getCategory())
                .description(templateDto.getDescription())
                .designContext(templateDto.getDesignContext())
                .systemImpacts(templateDto.getSystemImpacts())
                .assumptions(templateDto.getAssumptions())
                .outOfScope(templateDto.getOutOfScope())
                .otherAreasToConsider(templateDto.getOtherAreasToConsider())
                .appendix(templateDto.getAppendix())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .createdBy(userId)
                .build();

        Template savedTemplate = templateRepository.save(template);
        return convertToDto(savedTemplate);
    }

    public TemplateDto updateTemplate(String id, TemplateDto templateDto) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));

        if (templateDto.getTitle() != null) {
            template.setTitle(templateDto.getTitle());
        }
        if (templateDto.getCategory() != null) {
            template.setCategory(templateDto.getCategory());
        }
        if (templateDto.getDescription() != null) {
            template.setDescription(templateDto.getDescription());
        }
        if (templateDto.getDesignContext() != null) {
            template.setDesignContext(templateDto.getDesignContext());
        }
        if (templateDto.getSystemImpacts() != null) {
            template.setSystemImpacts(templateDto.getSystemImpacts());
        }
        if (templateDto.getAssumptions() != null) {
            template.setAssumptions(templateDto.getAssumptions());
        }
        if (templateDto.getOutOfScope() != null) {
            template.setOutOfScope(templateDto.getOutOfScope());
        }
        if (templateDto.getOtherAreasToConsider() != null) {
            template.setOtherAreasToConsider(templateDto.getOtherAreasToConsider());
        }
        if (templateDto.getAppendix() != null) {
            template.setAppendix(templateDto.getAppendix());
        }

        template.setUpdatedAt(LocalDateTime.now());
        Template updatedTemplate = templateRepository.save(template);
        return convertToDto(updatedTemplate);
    }

    public void deleteTemplate(String id) {
        if (!templateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Template not found with id: " + id);
        }
        templateRepository.deleteById(id);
    }

    public TemplateDto toggleLike(String templateId, String userId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));

        Set<String> likes = template.getLikes();
        if (likes == null) {
            likes = new HashSet<>();
        }

        if (likes.contains(userId)) {
            likes.remove(userId);
        } else {
            likes.add(userId);
        }

        template.setLikes(likes);
        Template savedTemplate = templateRepository.save(template);
        return convertToDto(savedTemplate);
    }

    public List<CommentDto> getComments(String templateId) {
        List<Comment> comments = commentRepository.findByTemplateIdOrderByCreatedAtDesc(templateId);
        return comments.stream()
                .map(this::convertToCommentDto)
                .collect(Collectors.toList());
    }

    public CommentDto addComment(String templateId, CommentDto commentDto, String userId) {
        Template template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));

        Comment comment = Comment.builder()
                .templateId(templateId)
                .userId(userId)
                .content(commentDto.getContent())
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Update comment count on template
        template.setCommentCount(template.getCommentCount() + 1);
        templateRepository.save(template);

        return convertToCommentDto(savedComment);
    }

    private TemplateDto convertToDto(Template template) {
        return TemplateDto.builder()
                .id(template.getId())
                .title(template.getTitle())
                .category(template.getCategory())
                .description(template.getDescription())
                .designContext(template.getDesignContext())
                .systemImpacts(template.getSystemImpacts())
                .assumptions(template.getAssumptions())
                .outOfScope(template.getOutOfScope())
                .otherAreasToConsider(template.getOtherAreasToConsider())
                .appendix(template.getAppendix())
                .createdBy(template.getCreatedBy())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .likes(template.getLikes())
                .commentCount(template.getCommentCount())
                .build();
    }

    private CommentDto convertToCommentDto(Comment comment) {
        return CommentDto.builder()
                .id(comment.getId())
                .templateId(comment.getTemplateId())
                .userId(comment.getUserId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
