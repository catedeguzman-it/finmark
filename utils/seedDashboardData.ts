import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  organizationsTable, 
  dashboardsTable, 
  organizationDashboardsTable,
  usersTable,
  userOrganizationsTable
} from '@/db/schema';
import { organizations } from '@/app/dashboard/data/organizations';
import { dashboards } from '@/app/dashboard/data/dashboards';
import { userProfiles } from '@/app/dashboard/data/users';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function seedOrganizations() {
  console.log('🏢 Seeding organizations...');
  
  for (const org of organizations) {
    try {
      await db.insert(organizationsTable).values({
        externalId: org.id,
        name: org.name,
        description: org.description,
        type: org.type,
        established: org.established,
        location: org.location,
        employees: org.employees,
        revenue: org.revenue,
        industry: org.industry,
        website: org.website,
        phone: org.phone,
        status: org.status,
        plan: org.plan,
        lastAccessed: new Date(org.lastAccessed),
        metadata: JSON.stringify({
          availableDashboards: org.availableDashboards
        })
      }).onConflictDoUpdate({
        target: organizationsTable.externalId,
        set: {
          name: org.name,
          description: org.description,
          type: org.type,
          established: org.established,
          location: org.location,
          employees: org.employees,
          revenue: org.revenue,
          industry: org.industry,
          website: org.website,
          phone: org.phone,
          status: org.status,
          plan: org.plan,
          lastAccessed: new Date(org.lastAccessed),
          metadata: JSON.stringify({
            availableDashboards: org.availableDashboards
          }),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Seeded organization: ${org.name}`);
    } catch (error) {
      console.error(`❌ Error seeding organization ${org.name}:`, error);
    }
  }
}

async function seedDashboards() {
  console.log('📊 Seeding dashboards...');
  
  for (const dashboard of dashboards) {
    try {
      await db.insert(dashboardsTable).values({
        id: dashboard.id,
        title: dashboard.title,
        description: dashboard.description,
          icon: dashboard.icon,        category: dashboard.category,
        status: dashboard.status,
        color: dashboard.color,
        bgColor: dashboard.bgColor,
        iconColor: dashboard.iconColor,
        requiredRoles: JSON.stringify(dashboard.requiredRole),
        metrics: JSON.stringify(dashboard.metrics),
        metadata: JSON.stringify({
          // Store any additional dashboard metadata here
        })
      }).onConflictDoUpdate({
        target: dashboardsTable.id,
        set: {
          title: dashboard.title,
          description: dashboard.description,
        icon: dashboard.icon,          category: dashboard.category,
          status: dashboard.status,
          color: dashboard.color,
          bgColor: dashboard.bgColor,
          iconColor: dashboard.iconColor,
          requiredRoles: JSON.stringify(dashboard.requiredRole),
          metrics: JSON.stringify(dashboard.metrics),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Seeded dashboard: ${dashboard.title}`);
    } catch (error) {
      console.error(`❌ Error seeding dashboard ${dashboard.title}:`, error);
    }
  }
}

async function seedOrganizationDashboards() {
  console.log('🔗 Seeding organization-dashboard relationships...');
  
  // Get all organizations from database
  const dbOrganizations = await db.select().from(organizationsTable);
  
  for (const dbOrg of dbOrganizations) {
    if (!dbOrg.metadata) continue;
    
    try {
      const metadata = JSON.parse(dbOrg.metadata);
      const availableDashboards = metadata.availableDashboards || [];
      
      for (const dashboardId of availableDashboards) {
        try {
          await db.insert(organizationDashboardsTable).values({
            organizationId: dbOrg.id,
            dashboardId: dashboardId
          }).onConflictDoNothing();
          
          console.log(`✅ Linked ${dbOrg.name} to ${dashboardId} dashboard`);
        } catch (error) {
          console.error(`❌ Error linking ${dbOrg.name} to ${dashboardId}:`, error);
        }
      }
    } catch (error) {
      console.error(`❌ Error parsing metadata for ${dbOrg.name}:`, error);
    }
  }
}

async function seedUserProfiles() {
  console.log('👥 Seeding user profiles...');
  
  // Get all organizations from database for mapping
  const dbOrganizations = await db.select().from(organizationsTable);
  const orgMap = new Map(dbOrganizations.map(org => [org.externalId, org.id]));
  
  for (const [email, profile] of Object.entries(userProfiles)) {
    try {
      // Insert or update user
      const [user] = await db.insert(usersTable).values({
        authUserId: `dummy-${email}`, // Dummy auth ID for seeding
        name: profile.name,
        email: email,
        position: profile.position,
        role: profile.role,
        isOnboarded: true
      }).onConflictDoUpdate({
        target: usersTable.email,
        set: {
          name: profile.name,
          position: profile.position,
          role: profile.role,
          updatedAt: new Date()
        }
      }).returning();
      
      console.log(`✅ Seeded user: ${profile.name} (${email})`);
      
      // Link user to organizations
      for (const orgExternalId of profile.assignedOrganizations) {
        const orgId = orgMap.get(orgExternalId);
        if (orgId) {
          try {
            await db.insert(userOrganizationsTable).values({
              userId: user.id,
              organizationId: orgId,
              isDefault: profile.assignedOrganizations[0] === orgExternalId // First org is default
            }).onConflictDoNothing();
            
            console.log(`✅ Linked ${profile.name} to organization ${orgExternalId}`);
          } catch (error) {
            console.error(`❌ Error linking user to organization:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error seeding user ${email}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting dashboard data seeding...');
    
    await seedOrganizations();
    await seedDashboards();
    await seedOrganizationDashboards();
    await seedUserProfiles();
    
    console.log('✅ Dashboard data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the seeder
if (require.main === module) {
  main();
}

export { main as seedDashboardData };