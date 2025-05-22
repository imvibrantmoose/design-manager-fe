package com.designtemplate.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "templates")
public class Template {
    @Id
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
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private String createdBy;
    
    private Set<String> likes = new HashSet<>();
    
    private int commentCount = 0;
    
    private Set<String> bookmarks = new HashSet<>();
    
    private int bookmarkCount = 0;
}
