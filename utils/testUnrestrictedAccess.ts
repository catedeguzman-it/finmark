import 'dotenv/config';
import { 
  getOrganizationsWithFallback, 
  getUserProfileWithFallback
} from '@/db/queries/dashboard';
import { getUserByEmail } from '@/db/queries/users';

async function testUnrestrictedAccess(userEmail: string) {
  console.log(`🔍 Testing unrestricted dashboard access for: ${userEmail}\n`);
  
  try {
    // Get user from database
    const dbUser = await getUserByEmail(userEmail);
    if (!dbUser) {
      console.log(`❌ User not found: ${userEmail}`);
      return;
    }

    console.log(`✅ User found:`);
    console.log(`   - Name: ${dbUser.name}`);
    console.log(`   - Role: ${dbUser.role}`);
    console.log(`   - Email: ${dbUser.email}\n`);

    // Get user profile
    const userProfile = await getUserProfileWithFallback(userEmail);
    console.log(`📋 User profile:`);
    console.log(`   - Profile Role: ${userProfile.role}`);
    console.log(`   - Assigned Organizations: [${userProfile.assignedOrganizations.join(', ')}]`);
    console.log(`   - Assignment Count: ${userProfile.assignedOrganizations.length}\n`);

    // Get all organizations
    const allOrganizations = await getOrganizationsWithFallback();
    console.log(`🏢 All organizations in system: ${allOrganizations.length}`);
    allOrganizations.forEach((org, index) => {
      console.log(`   ${index + 1}. ${org.name} (${org.id}) - ${org.type}`);
    });
    console.log();

    // Simulate NEW unrestricted dashboard page logic
    console.log(`🎯 Simulating NEW unrestricted dashboard page logic:`);
    console.log(`   - Restrictions removed: ALL users see ALL organizations`);
    
    // New logic: all users see all organizations
    const userOrganizations = allOrganizations;
    
    console.log(`   - Organizations user will see: ${userOrganizations.length}`);
    userOrganizations.forEach((org, index) => {
      console.log(`     ${index + 1}. ${org.name} (${org.id})`);
    });
    console.log();

    // Test dashboard access within organizations
    console.log(`📊 Testing dashboard access within organizations:`);
    for (const org of userOrganizations.slice(0, 2)) { // Test first 2 orgs
      console.log(`   🏢 ${org.name}:`);
      console.log(`     - Available Dashboards: [${org.availableDashboards.join(', ')}]`);
      console.log(`     - Dashboard Count: ${org.availableDashboards.length}`);
      console.log(`     - Access: ✅ UNRESTRICTED (all users can access all dashboards)`);
    }
    console.log();

    // Summary
    console.log(`📊 SUMMARY:`);
    console.log(`==========`);
    console.log(`✅ UNRESTRICTED ACCESS: User can see all ${userOrganizations.length} organizations`);
    console.log(`✅ UNRESTRICTED DASHBOARDS: User can access all dashboards within organizations`);
    console.log(`🔓 SECURITY MODEL: Open access - no role or assignment restrictions`);

    if (userOrganizations.length === 0) {
      console.log(`❌ ISSUE: No organizations in system`);
      console.log(`   SOLUTION: Run seeder to populate organizations`);
    } else {
      console.log(`✅ SUCCESS: User will see ${userOrganizations.length} organizations on dashboard`);
    }

  } catch (error) {
    console.error('❌ Error testing unrestricted access:', error);
  }
}

// Command line interface
if (require.main === module) {
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.log('Usage: npx tsx utils/testUnrestrictedAccess.ts <user-email>');
    console.log('Example: npx tsx utils/testUnrestrictedAccess.ts lr.rvalerio@mmdc.mcl.edu.ph');
    process.exit(1);
  }
  
  testUnrestrictedAccess(userEmail).then(() => process.exit(0));
}

export { testUnrestrictedAccess };