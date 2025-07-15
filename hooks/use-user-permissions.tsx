'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Role, Permission, hasPermission } from '@/lib/rbac';

interface UserPermissions {
  role: Role | null;
  organizationId: number | null;
  hasPermission: (permission: Permission) => boolean;
  isLoading: boolean;
}

const UserPermissionsContext = createContext<UserPermissions>({
  role: null,
  organizationId: null,
  hasPermission: () => false,
  isLoading: true,
});

export function UserPermissionsProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserPermissions() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoading(false);
          return;
        }

        // For now, we'll use a default role based on user metadata or a simple check
        // In a real implementation, this would call an API route that fetches from the database
        const userRole = user.user_metadata?.role as Role || 'viewer';
        const orgId = user.user_metadata?.organizationId || 1;
        
        setRole(userRole);
        setOrganizationId(orgId);
      } catch (error) {
        console.error('Error loading user permissions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserPermissions();
  }, []);

  const checkPermission = (permission: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  return (
    <UserPermissionsContext.Provider
      value={{
        role,
        organizationId,
        hasPermission: checkPermission,
        isLoading,
      }}
    >
      {children}
    </UserPermissionsContext.Provider>
  );
}

export function useUserPermissions() {
  const context = useContext(UserPermissionsContext);
  if (!context) {
    throw new Error('useUserPermissions must be used within a UserPermissionsProvider');
  }
  return context;
}