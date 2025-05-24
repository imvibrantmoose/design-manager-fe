import { UserList } from "../components/UserList";
import { useUsers } from "../hooks/useUsers";

export const UserManagementPage = () => {
  const { users, loading, error, handleRoleChange, handleStatusToggle } = useUsers();

  return (
    <div className="container mx-auto p-6 space-y-6 bg-background">
      <h1 className="text-3xl font-bold text-foreground">User Management</h1>
      <UserList 
        users={users}
        loading={loading}
        error={error}
        onRoleChange={handleRoleChange}
        onStatusToggle={handleStatusToggle}
      />
    </div>
  );
};
