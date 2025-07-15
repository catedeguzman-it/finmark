import 'dotenv/config';
import { 
  getOrganizationsWithFallback, 
  getUserProfileWithFallback
} from '@/db/queries/dashboard';
import { getUserByEmail } from '@/db/queries/users';

async function testAdminAccess(userEmail: string) {
  console.log(`🔍 Testing admin access for: ${userEmail}\n`);
  
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

    // Simulate dashboard page logic
    console.log(`🎯 Simulating dashboard page logic:`);
    const isAdmin = (dbUser.role === 'root_admin' || dbUser.role === 'admin');
    console.log(`   - Is Admin: ${isAdmin}`);
    
    const userOrganizations = isAdmin 
      ? allOrganizations 
      : allOrganizations.filter(org => 
          userProfile.assignedOrganizations.includes(org.id)
        );
    
    console.log(`   - Organizations user will see: ${userOrganizations.length}`);
    userOrganizations.forEach((org, index) => {
      console.log(`     ${index + 1}. ${org.name} (${org.id})`);
    });
    console.log();

    // Summary
    console.log(`📊 SUMMARY:`);
    console.log(`==========`);
    if (isAdmin) {
      console.log(`✅ ADMIN ACCESS: User can see all ${userOrganizations.length} organizations`);
      console.log(`   Root admins and admins have full access to all organizations`);
    } else {
      console.log(`👤 REGULAR USER: User can see ${userOrganizations.length} assigned organizations`);
      console.log(`   Regular users only see organizations they're explicitly assigned to`);
    }

    if (userOrganizations.length === 0) {
      console.log(`❌ ISSUE: User will see no organizations on dashboard`);
      if (!isAdmin) {
        console.log(`   SOLUTION: Assign user to organizations or upgrade to admin role`);
      }
    } else {
      console.log(`✅ SUCCESS: User will see organizations on dashboard`);
    }

  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  }
}

// Command line interface
if (require.main === module) {
  const userEmail = process.argv[2];
  if (!userEmail) {
    console.log('Usage: npx tsx utils/testAdminAccess.ts <user-email>');
    console.log('Example: npx tsx utils/testAdminAccess.ts valerioreden@gmail.com');
    process.exit(1);
  }
  
  testAdminAccess(userEmail).then(() => process.exit(0));
}

export { testAdminAccess };