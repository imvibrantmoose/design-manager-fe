import api from "./api";

export interface CommentType {
  id: string;
  templateId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  designContext: string;
  systemImpacts?: string;
  assumptions?: string;
  outOfScope?: string;
  otherAreasToConsider?: string;
  appendix?: string;
  createdBy: string; // Use this instead of userId
  createdByName: string; // Add this field
  createdAt: string;
  updatedAt: string;
  likes: string[];
  commentCount: number;
}

const templateService = {
  getAllTemplates: async (page: number = 0, size: number = 9): Promise<Template[]> => {
    const response = await api.get(`/templates?page=${page}&size=${size}`);
    return response.data;
  },

  getTemplateById: async (id: string): Promise<Template> => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  createTemplate: async (
    template: Omit<Template, "id" | "createdAt" | "updatedAt">,
  ): Promise<Template> => {
    const response = await api.post("/templates", template);
    return response.data;
  },

  updateTemplate: async (
    id: string,
    template: Partial<Template>,
  ): Promise<Template> => {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/templates/${id}`);
  },

  toggleLike: async (id: string): Promise<Template> => {
    const response = await api.post(`/templates/${id}/like`);
    return response.data;
  },

  getComments: async (id: string): Promise<CommentType[]> => {
    const response = await api.get(`/templates/${id}/comments`);
    return response.data;
  },

  addComment: async (id: string, content: string): Promise<CommentType> => {
    const response = await api.post(`/templates/${id}/comments`, { content });
    return response.data;
  },
};

export default templateService;
