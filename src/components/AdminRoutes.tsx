import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TemplateDetail from '../features/templates/pages/TemplateDetail';
// Update the import path to match the actual file name and extension, for example:
import UserManagement from './UserManagement';
import { CategoryManagement } from '@/features/templates/components/CategoryManagement';
// Or, if the file is named differently, update accordingly, e.g.:
// import UserManagement from './user-management';
// Make sure the file exists in the same directory.

const AdminRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/templates/:id/edit" 
        element={<TemplateDetail userRole="admin" />} 
      />
      <Route 
        path="/users" 
        element={<UserManagement />} 
      />
      <Route path="/categories" element={<CategoryManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
