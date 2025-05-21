package com.designtemplate.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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
}
