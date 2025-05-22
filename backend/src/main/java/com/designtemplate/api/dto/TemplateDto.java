package com.designtemplate.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TemplateDto {
    private String id;
    private String title;
    private String category;
    private String description;
    private String designContext;
    private String systemImpacts;
    private String assumptions;
    private String outOfScope;
    private String otherAreasToConsider;
    private String appendix;
    private String createdBy; // Make sure this field exists
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<String> likes;
    private int commentCount;
    private int bookmarkCount;
    private boolean isBookmarked;
}
