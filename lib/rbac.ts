export type Role = 'admin' | 'manager' | 'analyst' | 'viewer';

export type Permission = 
  | 'view_dashboards'
  | 'create_dashboards'
  | 'edit_dashboards'
  | 'delete_dashboards'
  | 'manage_users'
  | 'manage_organization'
  | 'view_financial_data'
  | 'edit_financial_data'
  | 'export_data'
  | 'view_analytics'
  | 'manage_settings';

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'view_dashboards',
    'create_dashboards',
    'edit_dashboards',
    'delete_dashboards',
    'manage_users',
    'manage_organization',
    'view_financial_data',
    'edit_financial_data',
    'export_data',
    'view_analytics',
    'manage_settings',
  ],
  manager: [
    'view_dashboards',
    'create_dashboards',
    'edit_dashboards',
    'view_financial_data',
    'edit_financial_data',
    'export_data',
    'view_analytics',
  ],
  analyst: [
    'view_dashboards',
    'view_financial_data',
    'export_data',
    'view_analytics',
  ],
  viewer: [
    'view_dashboards',
    'view_financial_data',
    'view_analytics',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function canAccessDashboard(role: Role): boolean {
  return hasPermission(role, 'view_dashboards');
}

export function canManageUsers(role: Role): boolean {
  return hasPermission(role, 'manage_users');
}

export function canEditFinancialData(role: Role): boolean {
  return hasPermission(role, 'edit_financial_data');
}

export function canExportData(role: Role): boolean {
  return hasPermission(role, 'export_data');
}

export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    analyst: 'Analyst',
    viewer: 'Viewer',
  };
  return roleNames[role];
}

export function getRoleDescription(role: Role): string {
  const descriptions: Record<Role, string> = {
    admin: 'Full access to all features and settings',
    manager: 'Can manage teams, projects, and financial data',
    analyst: 'Can view and analyze data, export reports',
    viewer: 'Read-only access to dashboards and data',
  };
  return descriptions[role];
}