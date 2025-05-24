export interface User {
  id: string;
  name: string;
  email: string;
  role: 'read' | 'read-write' | 'admin';
  status: 'active' | 'disabled';
  lastLogin: string;
}
