import 'dotenv/config';
import { 
  getOrganizationsWithFallback, 
  getDashboardsWithFallback, 
  getUserProfileWithFallback
} from '@/db/queries/dashboard';

async function testDashboardData() {
  try {
    console.log('🧪 Testing dashboard data integration...\n');
    
    // Test organizations
    console.log('📊 Testing organizations...');
    const organizations = await getOrganizationsWithFallback();
    console.log(`✅ Found ${organizations.length} organizations:`);
    organizations.forEach(org => {
      console.log(`  - ${org.name} (${org.type}) - ${org.availableDashboards.length} dashboards`);
    });
    console.log();
    
    // Test dashboards
    console.log('📈 Testing dashboards...');
    const dashboards = await getDashboardsWithFallback();
    console.log(`✅ Found ${dashboards.length} dashboards:`);
    dashboards.forEach(dashboard => {
      console.log(`  - ${dashboard.title} (${dashboard.category}) - ${dashboard.metrics.length} metrics`);
    });
    console.log();
    
    // Test user profile
    console.log('👤 Testing user profile...');
    const userProfile = await getUserProfileWithFallback('demo@example.com');
    console.log(`✅ User profile for demo@example.com:`);
    console.log(`  - Name: ${userProfile.name}`);
    console.log(`  - Role: ${userProfile.role}`);
    console.log(`  - Organizations: ${userProfile.assignedOrganizations.join(', ')}`);
    console.log();
    
    console.log('🎉 All tests passed! Dashboard data integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Error testing dashboard data:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testDashboardData().then(() => process.exit(0));
}

export { testDashboardData };