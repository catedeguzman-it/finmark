import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { 
  organizationsTable, 
  dashboardsTable, 
  organizationDashboardsTable,
  usersTable,
  userOrganizationsTable
} from '@/db/schema';
import { seedDashboardData } from './seedDashboardData';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function cleanupAllData() {
  console.log('🧹 Starting complete cleanup of organization and dashboard data...\n');
  
  try {
    // 1. Remove all user-organization assignments
    console.log('1️⃣ Removing all user-organization assignments...');
    await db.delete(userOrganizationsTable);
    console.log(`✅ Removed all user-organization assignments\n`);

    // 2. Remove all organization-dashboard relationships
    console.log('2️⃣ Removing all organization-dashboard relationships...');
    await db.delete(organizationDashboardsTable);
    console.log(`✅ Removed all organization-dashboard relationships\n`);

    // 3. Remove all dashboards
    console.log('3️⃣ Removing all dashboards...');
    await db.delete(dashboardsTable);
    console.log(`✅ Removed all dashboards\n`);

    // 4. Remove all organizations
    console.log('4️⃣ Removing all organizations...');
    await db.delete(organizationsTable);
    console.log(`✅ Removed all organizations\n`);

    console.log('🎉 Cleanup completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function showCurrentUsers() {
  console.log('👥 Current users in database:');
  console.log('============================');
  
  try {
    const users = await db.select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
      isOnboarded: usersTable.isOnboarded
    }).from(usersTable);

    if (users.length === 0) {
      console.log('No users found in database\n');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'Unnamed'} (${user.email})`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Onboarded: ${user.isOnboarded}`);
      console.log(`   - ID: ${user.id}`);
    });
    console.log();
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
  }
}

async function verifyCleanup() {
  console.log('🔍 Verifying cleanup...');
  console.log('======================');
  
  try {
    const [orgs, dashboards, orgDashboards, userOrgs] = await Promise.all([
      db.select().from(organizationsTable),
      db.select().from(dashboardsTable),
      db.select().from(organizationDashboardsTable),
      db.select().from(userOrganizationsTable)
    ]);

    console.log(`Organizations remaining: ${orgs.length}`);
    console.log(`Dashboards remaining: ${dashboards.length}`);
    console.log(`Organization-Dashboard relationships remaining: ${orgDashboards.length}`);
    console.log(`User-Organization assignments remaining: ${userOrgs.length}`);
    
    if (orgs.length === 0 && dashboards.length === 0 && orgDashboards.length === 0 && userOrgs.length === 0) {
      console.log('✅ Cleanup verified - all data removed\n');
      return true;
    } else {
      console.log('⚠️  Some data still remains\n');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verifying cleanup:', error);
    return false;
  }
}

async function verifyReseed() {
  console.log('🔍 Verifying reseed...');
  console.log('=====================');
  
  try {
    const [orgs, dashboards, orgDashboards, userOrgs] = await Promise.all([
      db.select().from(organizationsTable),
      db.select().from(dashboardsTable),
      db.select().from(organizationDashboardsTable),
      db.select().from(userOrganizationsTable)
    ]);

    console.log(`Organizations created: ${orgs.length}`);
    console.log(`Dashboards created: ${dashboards.length}`);
    console.log(`Organization-Dashboard relationships created: ${orgDashboards.length}`);
    console.log(`User-Organization assignments created: ${userOrgs.length}`);
    
    if (orgs.length > 0 && dashboards.length > 0) {
      console.log('✅ Reseed verified - data successfully created\n');
      
      // Show sample data
      console.log('📋 Sample organizations:');
      orgs.slice(0, 3).forEach((org, index) => {
        console.log(`   ${index + 1}. ${org.name} (${org.externalId}) - ${org.type}`);
      });
      
      console.log('\n📋 Sample dashboards:');
      dashboards.slice(0, 3).forEach((dashboard, index) => {
        console.log(`   ${index + 1}. ${dashboard.title} (${dashboard.id})`);
      });
      
      console.log('\n📋 Sample user assignments:');
      const userAssignments = await db
        .select({
          userName: usersTable.name,
          userEmail: usersTable.email,
          orgName: organizationsTable.name,
          orgExternalId: organizationsTable.externalId
        })
        .from(userOrganizationsTable)
        .innerJoin(usersTable, eq(userOrganizationsTable.userId, usersTable.id))
        .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
        .limit(5);
      
      userAssignments.forEach((assignment, index) => {
        console.log(`   ${index + 1}. ${assignment.userName} → ${assignment.orgName} (${assignment.orgExternalId})`);
      });
      console.log();
      
      return true;
    } else {
      console.log('❌ Reseed failed - no data created\n');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verifying reseed:', error);
    return false;
  }
}

async function main() {
  try {
    console.log('🚀 Starting complete cleanup and reseed process...\n');
    
    // Show current state
    await showCurrentUsers();
    
    // Step 1: Cleanup all data
    await cleanupAllData();
    
    // Step 2: Verify cleanup
    const cleanupSuccess = await verifyCleanup();
    if (!cleanupSuccess) {
      throw new Error('Cleanup verification failed');
    }
    
    // Step 3: Reseed all data
    console.log('🌱 Starting fresh reseed...\n');
    await seedDashboardData();
    
    // Step 4: Verify reseed
    const reseedSuccess = await verifyReseed();
    if (!reseedSuccess) {
      throw new Error('Reseed verification failed');
    }
    
    console.log('🎉 Complete cleanup and reseed process finished successfully!');
    console.log('✅ All organization and dashboard data has been refreshed');
    console.log('✅ All user assignments have been recreated');
    
  } catch (error) {
    console.error('❌ Error during cleanup and reseed process:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Command line interface
if (require.main === module) {
  const confirmFlag = process.argv[2];
  
  if (confirmFlag !== '--confirm') {
    console.log('⚠️  WARNING: This will delete ALL organization and dashboard data!');
    console.log('⚠️  This will remove ALL user-organization assignments!');
    console.log('⚠️  This action cannot be undone!');
    console.log('');
    console.log('To proceed, run:');
    console.log('npx tsx utils/cleanupAndReseed.ts --confirm');
    process.exit(0);
  }
  
  main();
}

export { cleanupAllData, verifyCleanup, verifyReseed };