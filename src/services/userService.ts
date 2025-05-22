import api from "./api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const userService = {
  getUserById: async (idOrEmail: string): Promise<User> => {
    try {
      if (idOrEmail.includes('@')) {
        const response = await api.get(`/users/email/${encodeURIComponent(idOrEmail)}`);
        return response.data;
      }
      const response = await api.get(`/users/${idOrEmail}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        id: idOrEmail,
        email: idOrEmail,
        name: 'Unknown User',
        role: 'unknown'
      };
    }
  }
};

export default userService;
