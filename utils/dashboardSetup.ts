import { initializeDatabase, checkDatabaseHealth } from './initializeDatabase';
import { createDatabaseIndexes, databaseMaintenance } from './databaseOptimization';
import { seedAllOrganizations } from './seedComprehensiveData';

export const setupDashboardSystem = async () => {
  console.log('🚀 Setting up FinMark dashboard system...');
  
  try {
    // Step 1: Check database health
    console.log('1️⃣ Checking database health...');
    const healthCheck = await checkDatabaseHealth();
    console.log(`Database status: ${healthCheck.message}`);
    
    // Step 2: Initialize database if needed
    if (healthCheck.needsSeeding) {
      console.log('2️⃣ Initializing database with sample data...');
      const initSuccess = await initializeDatabase();
      if (!initSuccess) {
        throw new Error('Database initialization failed');
      }
    } else {
      console.log('2️⃣ Database already initialized, skipping...');
    }
    
    // Step 3: Create performance indexes
    console.log('3️⃣ Creating database indexes for optimal performance...');
    const indexSuccess = await createDatabaseIndexes();
    if (!indexSuccess) {
      console.warn('⚠️  Index creation failed, but continuing...');
    }
    
    // Step 4: Update database statistics
    console.log('4️⃣ Updating database statistics...');
    await databaseMaintenance.updateStatistics();
    
    console.log('✅ Dashboard system setup completed successfully!');
    console.log('');
    console.log('📊 Your FinMark dashboard system is now ready with:');
    console.log('   • Comprehensive database schema');
    console.log('   • Realistic sample data for all dashboard types');
    console.log('   • Performance-optimized indexes');
    console.log('   • Multi-organization support');
    console.log('   • Real-time data fetching utilities');
    console.log('');
    
    return {
      success: true,
      message: 'Dashboard system setup completed successfully',
      features: [
        'E-commerce Analytics (Products, Orders, Customers)',
        'Financial Analytics (Portfolio, Metrics, Cash Flow)',
        'Manufacturing Analytics (Production, Supply Chain)',
        'Executive Overview (System Health, KPIs)',
        'Multi-currency Support',
        'Regional Performance Tracking',
        'Real-time System Metrics'
      ]
    };
  } catch (error) {
    console.error('❌ Dashboard system setup failed:', error);
    return {
      success: false,
      message: `Setup failed: ${error}`,
      features: []
    };
  }
};

// Quick setup for development
export const quickDevSetup = async () => {
  console.log('⚡ Quick development setup...');
  
  try {
    // Just seed data without full setup
    const success = await seedAllOrganizations();
    
    if (success) {
      console.log('✅ Development data seeded successfully!');
      return true;
    } else {
      console.error('❌ Development setup failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Quick setup error:', error);
    return false;
  }
};

// Production setup with additional safety checks
export const productionSetup = async () => {
  console.log('🏭 Production setup with safety checks...');
  
  try {
    // Check if we're in production environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('⚠️  Production environment detected');
      console.log('   • Skipping automatic data seeding');
      console.log('   • Only creating indexes and optimizations');
      
      // Only create indexes in production
      await createDatabaseIndexes();
      await databaseMaintenance.updateStatistics();
      
      return {
        success: true,
        message: 'Production optimizations applied',
        note: 'Data seeding skipped in production'
      };
    } else {
      // Full setup for non-production
      return await setupDashboardSystem();
    }
  } catch (error) {
    console.error('❌ Production setup failed:', error);
    return {
      success: false,
      message: `Production setup failed: ${error}`
    };
  }
};

// Utility to get setup status
export const getSetupStatus = async () => {
  try {
    const healthCheck = await checkDatabaseHealth();
    
    return {
      databaseHealthy: healthCheck.healthy,
      needsSeeding: healthCheck.needsSeeding,
      message: healthCheck.message,
      recommendations: healthCheck.needsSeeding 
        ? ['Run setupDashboardSystem() to initialize', 'Ensure database connection is working']
        : ['System ready for use', 'Consider running performance optimizations periodically']
    };
  } catch (error) {
    return {
      databaseHealthy: false,
      needsSeeding: true,
      message: `Setup status check failed: ${error}`,
      recommendations: ['Check database connection', 'Verify environment variables']
    };
  }
};