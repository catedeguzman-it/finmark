import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { 
  organizationsTable, 
  usersTable,
  userOrganizationsTable
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { 
  getUserProfileWithFallback,
  getOrganizationsWithFallback,
  getUserOrganizations
} from '@/db/queries/dashboard';

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
const db = drizzle(client);

async function debugOrganizationQueries(userEmail: string) {
  console.log(`🔍 Debugging organization queries for: ${userEmail}\n`);
  
  try {
    // 1. Check if user exists in database
    console.log('1️⃣ Checking user existence in database...');
    const [dbUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));
    
    if (!dbUser) {
      console.log(`❌ User not found in database: ${userEmail}`);
      console.log('   This user will get fallback dummy data\n');
    } else {
      console.log(`✅ User found in database:`);
      console.log(`   - ID: ${dbUser.id}`);
      console.log(`   - Name: ${dbUser.name}`);
      console.log(`   - Email: ${dbUser.email}`);
      console.log(`   - Role: ${dbUser.role}`);
      console.log(`   - Onboarded: ${dbUser.isOnboarded}\n`);
    }

    // 2. Check user-organization relationships
    console.log('2️⃣ Checking user-organization relationships...');
    if (dbUser) {
      const userOrgRelations = await db
        .select({
          userId: userOrganizationsTable.userId,
          organizationId: userOrganizationsTable.organizationId,
          isDefault: userOrganizationsTable.isDefault,
          orgName: organizationsTable.name,
          orgExternalId: organizationsTable.externalId
        })
        .from(userOrganizationsTable)
        .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
        .where(eq(userOrganizationsTable.userId, dbUser.id));

      console.log(`✅ Found ${userOrgRelations.length} organization relationships:`);
      userOrgRelations.forEach((rel, index) => {
        console.log(`   ${index + 1}. ${rel.orgName} (${rel.orgExternalId})`);
        console.log(`      - Organization ID: ${rel.organizationId}`);
        console.log(`      - Is Default: ${rel.isDefault}`);
      });
      console.log();
    }

    // 3. Test getUserProfile function
    console.log('3️⃣ Testing getUserProfile function...');
    const userProfile = await getUserProfileWithFallback(userEmail);
    console.log(`✅ User profile result:`);
    console.log(`   - Name: ${userProfile.name}`);
    console.log(`   - Role: ${userProfile.role}`);
    console.log(`   - Assigned Organizations: [${userProfile.assignedOrganizations.join(', ')}]`);
    console.log(`   - Organization Count: ${userProfile.assignedOrganizations.length}\n`);

    // 4. Test getUserOrganizations function
    console.log('4️⃣ Testing getUserOrganizations function...');
    try {
      const userOrgs = await getUserOrganizations(userEmail);
      console.log(`✅ getUserOrganizations returned ${userOrgs.length} organizations:`);
      userOrgs.forEach((org, index) => {
        console.log(`   ${index + 1}. ${org.name} (${org.id})`);
        console.log(`      - Type: ${org.type}`);
        console.log(`      - Available Dashboards: [${org.availableDashboards.join(', ')}]`);
      });
      console.log();
    } catch (error) {
      console.log(`❌ getUserOrganizations failed:`, error);
      console.log();
    }

    // 5. Test getOrganizationsWithFallback function
    console.log('5️⃣ Testing getOrganizationsWithFallback function...');
    const allOrgs = await getOrganizationsWithFallback();
    console.log(`✅ getOrganizationsWithFallback returned ${allOrgs.length} organizations:`);
    allOrgs.forEach((org, index) => {
      console.log(`   ${index + 1}. ${org.name} (${org.id}) - ${org.type}`);
    });
    console.log();

    // 6. Simulate dashboard page filtering logic
    console.log('6️⃣ Simulating dashboard page filtering logic...');
    const filteredOrgs = allOrgs.filter(org => 
      userProfile.assignedOrganizations.includes(org.id)
    );
    console.log(`✅ After filtering by user assignments: ${filteredOrgs.length} organizations:`);
    filteredOrgs.forEach((org, index) => {
      console.log(`   ${index + 1}. ${org.name} (${org.id})`);
    });
    console.log();

    // 7. Check for role-based access (root admin should see all?)
    console.log('7️⃣ Checking role-based access logic...');
    const actualRole = dbUser?.role || 'unknown';
    console.log(`👤 User's actual database role: ${actualRole}`);
    console.log(`👤 User's profile role (from getUserProfile): ${userProfile.role}`);
    
    if (actualRole === 'root_admin' || actualRole === 'admin') {
      console.log(`🔑 User has admin role in database (${actualRole})`);
      console.log(`   Should admins see all organizations? Currently: NO`);
      console.log(`   Current logic only shows assigned organizations`);
    } else {
      console.log(`👤 User has regular role: ${actualRole}`);
    }
    console.log();

    // 8. Raw database organization count
    console.log('8️⃣ Raw database organization count...');
    const totalOrgs = await db.select().from(organizationsTable);
    console.log(`✅ Total organizations in database: ${totalOrgs.length}`);
    console.log();

    // 9. Summary and recommendations
    console.log('📋 SUMMARY AND RECOMMENDATIONS:');
    console.log('================================');
    
    if (!dbUser) {
      console.log('❌ ISSUE: User not found in database');
      console.log('   SOLUTION: User needs to be seeded or created in database');
    } else if (userProfile.assignedOrganizations.length === 0) {
      console.log('❌ ISSUE: User has no organization assignments');
      console.log('   SOLUTION: Assign user to organizations in user_organizations_table');
    } else if (filteredOrgs.length === 0) {
      console.log('❌ ISSUE: Organization IDs mismatch between assignments and actual orgs');
      console.log('   SOLUTION: Check external_id mapping in organizations table');
    } else {
      console.log('✅ User should see organizations on dashboard');
    }

    if (actualRole === 'root_admin' || actualRole === 'admin') {
      console.log('💡 SUGGESTION: Consider allowing admins to see all organizations');
      console.log('   Current logic restricts admins to only assigned organizations');
    }

  } catch (error) {
    console.error('❌ Error during debugging:', error);
  } finally {
    await client.end();
  }
}

// Command line interface
if (require.main === module) {
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.log('Usage: npx tsx utils/debugOrganizationQueries.ts <user-email>');
    console.log('Example: npx tsx utils/debugOrganizationQueries.ts admin@example.com');
    process.exit(1);
  }
  
  debugOrganizationQueries(userEmail).then(() => process.exit(0));
}

export { debugOrganizationQueries };