import api from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/api/categories');
      return response.data;
    } catch (error) {
      // Return default categories if API fails
      return [
        { id: '1', name: 'UI Design', description: 'User Interface Design', createdBy: '', createdAt: '', updatedAt: '' },
        { id: '2', name: 'UX Design', description: 'User Experience Design', createdBy: '', createdAt: '', updatedAt: '' },
        { id: '3', name: 'System Design', description: 'System Architecture Design', createdBy: '', createdAt: '', updatedAt: '' },
        { id: '4', name: 'API Design', description: 'API Design and Documentation', createdBy: '', createdAt: '', updatedAt: '' }
      ];
    }
  },

  createCategory: async (category: Partial<Category>) => {
    const response = await api.post('/categories', category);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },

  getCategoryUsageCount: async (categoryName: string): Promise<number> => {
    const response = await api.get(`/categories/${categoryName}/usage`);
    return response.data;
  }
};

export default categoryService;
