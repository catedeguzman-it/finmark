'use client';

import { useUserPermissions } from '@/hooks/use-user-permissions';
import { Role } from '@/lib/rbac';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield } from 'lucide-react';

interface RoleBasedDashboardProps {
  children?: React.ReactNode;
}

export const roleDashboardConfig: Record<Role, string[]> = {
  root_admin: ['executive-overview', 'financial-analytics', 'ecommerce', 'manufacturing', 'healthcare'],
  admin: ['executive-overview', 'financial-analytics', 'ecommerce', 'manufacturing', 'healthcare'],
  manager: ['executive-overview', 'financial-analytics', 'ecommerce'],
  analyst: ['financial-analytics', 'ecommerce'],
  viewer: ['executive-overview'],
};

export function RoleBasedDashboard({ children }: RoleBasedDashboardProps) {
  const { role, hasPermission, isLoading } = useUserPermissions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Unable to determine your role. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasPermission('view_dashboards')) {
    return (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view dashboards. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's your {role} dashboard overview.
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}

export function useRoleBasedDashboards() {
  const { role } = useUserPermissions();
  return roleDashboardConfig[role || 'viewer'] || [];
}
