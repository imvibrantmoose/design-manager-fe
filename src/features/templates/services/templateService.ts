import api from "../../../lib/api";
import { Template } from "../types";

const templateService = {
  getAllTemplates: async (page: number = 0, size: number = 9) => {
    const response = await api.get(`/templates?page=${page}&size=${size}`);
    return response.data;
  },

  getTemplateById: async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  createTemplate: async (template: Partial<Template>) => {
    const response = await api.post('/templates', template);
    return response.data;
  },

  updateTemplate: async (id: string, template: Partial<Template>) => {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  },

  deleteTemplate: async (id: string) => {
    await api.delete(`/templates/${id}`);
  },

  toggleLike: async (id: string) => {
    const response = await api.post(`/templates/${id}/like`);
    return response.data;
  },

  getComments: async (id: string) => {
    const response = await api.get(`/templates/${id}/comments`);
    return response.data;
  },

  addComment: async (id: string, content: string) => {
    const response = await api.post(`/templates/${id}/comments`, { content });
    return response.data;
  },

  getVersions: async (templateId: string) => {
    const response = await api.get(`/templates/${templateId}/versions`);
    return response.data;
  },

  createVersion: async (templateId: string, changelog: string) => {
    const response = await api.post(`/templates/${templateId}/versions`, { changelog });
    return response.data;
  },

  revertToVersion: async (templateId: string, versionId: string) => {
    const response = await api.post(`/templates/${templateId}/versions/${versionId}/revert`);
    return response.data;
  },

  toggleBookmark: async (id: string) => {
    const response = await api.post(`/templates/${id}/bookmark`);
    return response.data;
  },

  getBookmarkedTemplates: async () => {
    const response = await api.get('/templates/bookmarked');
    return response.data;
  }
};

export default templateService;
