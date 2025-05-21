import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "read" | "read-write" | "admin";
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: "read" | "read-write" | "admin";
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: "read" | "read-write" | "admin";
  password?: string;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: CreateUserRequest): Promise<User> => {
    const response = await api.post("/users", user);
    return response.data;
  },

  updateUser: async (id: string, user: UpdateUserRequest): Promise<User> => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userService;
