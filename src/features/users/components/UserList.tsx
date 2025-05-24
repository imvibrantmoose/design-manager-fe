import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onRoleChange: (userId: string, role: string) => void;
  onStatusToggle: (userId: string) => void;
}

export const UserList = ({ users, loading, error, onRoleChange, onStatusToggle }: UserListProps) => {
  if (loading) {
    return <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  if (error) {
    return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <Card className="bg-card">
      <CardHeader className="border-b">
        <CardTitle className="text-card-foreground">User List</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Role</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.name}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{user.email}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <Select value={user.role} onValueChange={(value) => onRoleChange(user.id, value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="read-write">Read-Write</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <Button variant="outline" onClick={() => onStatusToggle(user.id)}>
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
