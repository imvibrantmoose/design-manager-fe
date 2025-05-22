package com.designtemplate.api.controller;

import com.designtemplate.api.dto.CommentDto;
import com.designtemplate.api.dto.TemplateDto;
import com.designtemplate.api.service.TemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/templates")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<Page<TemplateDto>> getAllTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(templateService.getAllTemplates(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TemplateDto> getTemplateById(@PathVariable String id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TemplateDto>> getTemplatesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(templateService.getTemplatesByCategory(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TemplateDto>> searchTemplates(@RequestParam String query) {
        return ResponseEntity.ok(templateService.searchTemplates(query));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('READ_WRITE')")
    public ResponseEntity<TemplateDto> createTemplate(
            @Valid @RequestBody TemplateDto templateDto,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userId = userDetails.getUsername(); // In our case, username is the user ID
        return ResponseEntity.ok(templateService.createTemplate(templateDto, userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('READ_WRITE')")
    public ResponseEntity<TemplateDto> updateTemplate(
            @PathVariable String id,
            @Valid @RequestBody TemplateDto templateDto) {
        return ResponseEntity.ok(templateService.updateTemplate(id, templateDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable String id) {
        templateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TemplateDto> toggleLike(
            @PathVariable String id,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(templateService.toggleLike(id, userDetails.getUsername()));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable String id) {
        return ResponseEntity.ok(templateService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentDto> addComment(
            @PathVariable String id,
            @Valid @RequestBody CommentDto commentDto,
            Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(templateService.addComment(id, commentDto, userDetails.getUsername()));
    }
}
