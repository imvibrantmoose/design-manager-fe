import api from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: "read" | "read-write" | "admin";
  status: "active" | "disabled";
  lastLogin: string;
}

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/api/users/${userId}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await api.put(`/api/users/${userId}/status`, { status });
    return response.data;
  }
};

export default userService;
