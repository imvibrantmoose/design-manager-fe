import api from '@/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'read' | 'read-write' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string): Promise<User> => {
    const response = await api.put(`/users/${userId}/status`, { status });
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get<User>(`/api/users/${userId}`);
    return response.data;
  },
};

export default userService;
