import { useState, useEffect } from 'react';
import userService, { User } from '@/services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await userService.updateUserRole(userId, role);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: role as User['role'] } : user
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await userService.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { users, loading, error, handleRoleChange, handleStatusToggle };
};
