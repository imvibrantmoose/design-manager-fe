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
