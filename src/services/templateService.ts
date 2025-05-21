import api from "./api";

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
  createdAt: string;
  updatedAt: string;
}

const templateService = {
  getAllTemplates: async (): Promise<Template[]> => {
    const response = await api.get("/templates");
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
};

export default templateService;
