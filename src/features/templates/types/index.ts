export interface Template {
    id: string;
    title: string;
    category: string;
    description: string;
    designContext: string;
    systemImpacts: string;
    assumptions: string;
    outOfScope: string;
    otherAreasToConsider: string;
    appendix: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    likes: string[];
    commentCount: number;
}

export interface Comment {
    id: string;
    templateId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  content: Partial<Template>;
  createdBy: string;
  createdAt: string;
  changelog: string;
}
