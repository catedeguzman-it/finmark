import { db } from '@/db';
import { organizationsTable } from '@/db/schema';
import { seedAllOrganizations } from './seedComprehensiveData';

export const initializeDatabase = async () => {
  console.log('🚀 Initializing database with comprehensive data...');
  
  try {
    // Check if organizations exist
    const existingOrgs = await db.select({ id: organizationsTable.id }).from(organizationsTable).limit(1);
    
    if (existingOrgs.length === 0) {
      console.log('📝 No organizations found. Creating sample organizations...');
      
      // Create sample organizations
      const sampleOrgs = [
        {
          name: 'Maybank Singapore',
          description: 'Leading financial services provider in Southeast Asia',
        },
        {
          name: 'Singapore General Hospital',
          description: 'Premier healthcare institution providing world-class medical services',
        },
        {
          name: 'Shopee Singapore',
          description: 'Leading e-commerce platform connecting millions of buyers and sellers',
        },
        {
          name: 'Genting Plantations',
          description: 'Integrated agribusiness corporation focusing on sustainable plantation management',
        },
      ];

      await db.insert(organizationsTable).values(sampleOrgs);
      console.log('✅ Sample organizations created');
    }

    // Seed comprehensive data for all organizations
    const success = await seedAllOrganizations();
    
    if (success) {
      console.log('🎉 Database initialization completed successfully!');
      return true;
    } else {
      console.error('❌ Database initialization failed');
      return false;
    }
  } catch (error) {
    console.error('💥 Error during database initialization:', error);
    return false;
  }
};

// Utility to check if database is properly seeded
export const checkDatabaseHealth = async () => {
  try {
    const orgs = await db.select({ id: organizationsTable.id }).from(organizationsTable);
    
    if (orgs.length === 0) {
      return {
        healthy: false,
        message: 'No organizations found in database',
        needsSeeding: true,
      };
    }

    return {
      healthy: true,
      message: `Database healthy with ${orgs.length} organizations`,
      needsSeeding: false,
    };
  } catch (error) {
    return {
      healthy: false,
      message: `Database connection error: ${error}`,
      needsSeeding: true,
    };
  }
};