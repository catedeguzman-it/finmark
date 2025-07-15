'use client';

import { useState } from 'react';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { UserInvitationForm } from './UserInvitationForm';
import { OrganizationForm } from './OrganizationForm';
import { RoleManagement } from './RoleManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Building2, Users, BarChart3 } from 'lucide-react';
import { Role } from '@/lib/rbac';

interface Organization {
  id: number;
  name: string;
  description?: string;
  type: string;
  createdAt: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  organizationId: number;
}

export function AdminDashboard() {
  const { hasPermission } = useUserPermissions();
  const [organizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  if (!hasPermission('manage_organization') && !hasPermission('manage_users')) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access the admin dashboard.
        </AlertDescription>
      </Alert>
    );
  }



  const handleRoleChange = (userId: number, newRole: Role) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage organizations, users, and system settings
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Admin Access
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">
              Total organizations
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Total users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Current active users
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="organizations" className="space-y-4">
        <TabsList>
          {hasPermission('manage_organization') && (
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          )}
          {hasPermission('manage_users') && (
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
          )}
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        {hasPermission('manage_organization') && (
          <TabsContent value="organizations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Management</CardTitle>
                <CardDescription>
                  Create and manage organizations in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Organizations</h3>
                    <p className="text-sm text-gray-500">
                      {organizations.length} organizations total
                    </p>
                  </div>
                  <OrganizationForm />
                </div>
                
                {organizations.length === 0 ? (
                  <Alert>
                    <Building2 className="h-4 w-4" />
                    <AlertDescription>
                      No organizations created yet. Create your first organization to get started.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    {organizations.map((org) => (
                      <div key={org.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{org.name}</div>
                        <div className="text-sm text-gray-500">{org.type}</div>
                        {org.description && (
                          <div className="text-sm text-gray-600 mt-1">{org.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {hasPermission('manage_users') && (
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  User & Role Management
                  <UserInvitationForm organizations={organizations} />
                </CardTitle>
                <CardDescription>
                  Invite users and manage roles across organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RoleManagement users={users} onRoleChange={handleRoleChange} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  System settings will be available in a future update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}