'use client';

import { useState } from 'react';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { Role, getRoleDisplayName, getRoleDescription } from '@/lib/rbac';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Edit } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  organizationId: number;
}

interface RoleManagementProps {
  users?: User[];
  onRoleChange?: (userId: number, newRole: Role) => void;
}

export function RoleManagement({ users = [], onRoleChange }: RoleManagementProps) {
  const { hasPermission } = useUserPermissions();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<Role | null>(null);

  if (!hasPermission('manage_users')) {
    return null;
  }

  const handleRoleChange = (user: User) => {
    if (newRole && onRoleChange) {
      onRoleChange(user.id, newRole);
      setIsOpen(false);
      setSelectedUser(null);
      setNewRole(null);
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'analyst':
        return 'secondary';
      case 'viewer':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const roles: Role[] = ['admin', 'manager', 'analyst', 'viewer'];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Role Management</h3>
      </div>

      {users.length === 0 ? (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            No users found. Users will appear here once they join the organization.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
                
                <Dialog open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                  setIsOpen(open);
                  if (!open) {
                    setSelectedUser(null);
                    setNewRole(null);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change User Role</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select New Role</label>
                        <Select
                          value={newRole || user.role}
                          onValueChange={(value) => setNewRole(value as Role)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role} value={role}>
                                <div>
                                  <div className="font-medium">{getRoleDisplayName(role)}</div>
                                  <div className="text-xs text-gray-500">{getRoleDescription(role)}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleRoleChange(user)}
                          disabled={!newRole || newRole === user.role}
                          className="flex-1"
                        >
                          Update Role
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}