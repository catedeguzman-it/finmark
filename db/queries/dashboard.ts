import { db } from '@/db';
import { 
  organizationsTable, 
  dashboardsTable, 
  organizationDashboardsTable,
  usersTable,
  userOrganizationsTable
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Organization, Dashboard, UserProfile } from '@/app/dashboard/types';

// Get all organizations
export async function getOrganizations(): Promise<Organization[]> {
  const organizations = await db.select().from(organizationsTable);
  
  return organizations.map(org => {
    const metadata = org.metadata ? JSON.parse(org.metadata) : {};
    return {
      id: org.externalId || org.id.toString(),
      name: org.name,
      type: org.type as Organization['type'],
      description: org.description || '',
      established: org.established || '',
      location: org.location || '',
      employees: org.employees || 0,
      revenue: org.revenue || '',
      industry: org.industry || '',
      website: org.website || '',
      phone: org.phone || '',
      availableDashboards: metadata.availableDashboards || [],
      status: org.status as Organization['status'],
      plan: org.plan as Organization['plan'],
      lastAccessed: org.lastAccessed?.toISOString() || new Date().toISOString()
    };
  });
}

// Get organizations for a specific user
export async function getUserOrganizations(userEmail: string): Promise<Organization[]> {
  const userOrgs = await db
    .select({
      organization: organizationsTable
    })
    .from(userOrganizationsTable)
    .innerJoin(usersTable, eq(userOrganizationsTable.userId, usersTable.id))
    .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
    .where(eq(usersTable.email, userEmail));

  return userOrgs.map(({ organization: org }) => {
    const metadata = org.metadata ? JSON.parse(org.metadata) : {};
    return {
      id: org.externalId || org.id.toString(),
      name: org.name,
      type: org.type as Organization['type'],
      description: org.description || '',
      established: org.established || '',
      location: org.location || '',
      employees: org.employees || 0,
      revenue: org.revenue || '',
      industry: org.industry || '',
      website: org.website || '',
      phone: org.phone || '',
      availableDashboards: metadata.availableDashboards || [],
      status: org.status as Organization['status'],
      plan: org.plan as Organization['plan'],
      lastAccessed: org.lastAccessed?.toISOString() || new Date().toISOString()
    };
  });
}

// Get all dashboards
export async function getDashboards(): Promise<Dashboard[]> {
  const dashboards = await db.select().from(dashboardsTable);
  
  return dashboards.map(dashboard => ({
    id: dashboard.id,
    title: dashboard.title,
    description: dashboard.description || '',
    icon: dashboard.icon || 'BarChart3',
    metrics: dashboard.metrics ? JSON.parse(dashboard.metrics) : [],
    status: dashboard.status || 'operational',
    category: dashboard.category || 'General',
    color: dashboard.color || 'from-blue-500 to-blue-600',
    bgColor: dashboard.bgColor || 'bg-blue-50',
    iconColor: dashboard.iconColor || 'text-blue-600',
    requiredRole: dashboard.requiredRoles ? JSON.parse(dashboard.requiredRoles) : ['analyst']
  }));
}

// Get dashboards available to a specific organization
export async function getOrganizationDashboards(organizationId: string): Promise<Dashboard[]> {
  // First get the internal organization ID
  const [org] = await db
    .select({ id: organizationsTable.id })
    .from(organizationsTable)
    .where(eq(organizationsTable.externalId, organizationId));

  if (!org) return [];

  const orgDashboards = await db
    .select({
      dashboard: dashboardsTable
    })
    .from(organizationDashboardsTable)
    .innerJoin(dashboardsTable, eq(organizationDashboardsTable.dashboardId, dashboardsTable.id))
    .where(eq(organizationDashboardsTable.organizationId, org.id));

  return orgDashboards.map(({ dashboard }) => ({
    id: dashboard.id,
    title: dashboard.title,
    description: dashboard.description || '',
    icon: dashboard.icon || 'BarChart3',
    metrics: dashboard.metrics ? JSON.parse(dashboard.metrics) : [],
    status: dashboard.status || 'operational',
    category: dashboard.category || 'General',
    color: dashboard.color || 'from-blue-500 to-blue-600',
    bgColor: dashboard.bgColor || 'bg-blue-50',
    iconColor: dashboard.iconColor || 'text-blue-600',
    requiredRole: dashboard.requiredRoles ? JSON.parse(dashboard.requiredRoles) : ['analyst']
  }));
}

// Get user profile from database
export async function getUserProfile(userEmail: string): Promise<UserProfile | null> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, userEmail));

  if (!user) return null;

  // Get user's assigned organizations
  const userOrgs = await db
    .select({
      externalId: organizationsTable.externalId
    })
    .from(userOrganizationsTable)
    .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
    .where(eq(userOrganizationsTable.userId, user.id));

  return {
    name: user.name || 'Unknown User',
    position: user.position || 'User',
    department: 'Analytics', // Default department
    location: 'Singapore', // Default location
    role: user.role as UserProfile['role'],
    assignedOrganizations: [...new Set(userOrgs.map(org => org.externalId).filter(Boolean))] as string[],
    permissions: ['view', 'export', 'share'], // Default permissions
    lastActive: new Date().toISOString(),
    avatar: null
  };
}



// Fallback functions that use the original dummy data if database is empty
export async function getOrganizationsWithFallback(): Promise<Organization[]> {
  const dbOrgs = await getOrganizations();
  if (dbOrgs.length > 0) return dbOrgs;
  
  // Fallback to dummy data
  const { organizations } = await import('@/app/dashboard/data/organizations');
  return organizations;
}

export async function getDashboardsWithFallback(): Promise<Dashboard[]> {
  const dbDashboards = await getDashboards();
  if (dbDashboards.length > 0) return dbDashboards;
  
  // Fallback to dummy data
  const { dashboards } = await import('@/app/dashboard/data/dashboards');
  return dashboards;
}

export async function getUserProfileWithFallback(userEmail: string): Promise<UserProfile> {
  const dbProfile = await getUserProfile(userEmail);
  if (dbProfile) return dbProfile;
  
  // Fallback to dummy data
  const { getUserProfile: getDummyProfile } = await import('@/app/dashboard/data/users');
  return getDummyProfile(userEmail);
}