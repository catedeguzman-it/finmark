import { db } from '@/db';
import { sql } from 'drizzle-orm';

export const createDatabaseIndexes = async () => {
  console.log('🔧 Creating database indexes for optimal performance...');
  
  try {
    // E-commerce indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_products_org_platform ON products_table(organization_id, platform)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_products_sold ON products_table(sold DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customers_org_segment ON customers_table(organization_id, segment)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_customers_total_spent ON customers_table(total_spent DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_orders_org_date ON orders_table(organization_id, order_date DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders_table(status)`);
    
    // Financial indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_portfolio_org_value ON portfolio_holdings_table(organization_id, value DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_financial_metrics_org_period ON financial_metrics_table(organization_id, period DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_cash_flow_org_period ON cash_flow_data_table(organization_id, period DESC)`);
    
    // Manufacturing indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_production_org_period ON production_data_table(organization_id, period DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_production_region ON production_data_table(region)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_supply_chain_org_week ON supply_chain_metrics_table(organization_id, week DESC)`);
    
    // System metrics indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_system_metrics_org_name ON system_metrics_table(organization_id, metric_name)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_system_metrics_updated ON system_metrics_table(updated_at DESC)`);
    
    // Sales data indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_sales_org_date ON sales_data_table(organization_id, date DESC)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_sales_platform ON sales_data_table(platform)`);
    
    console.log('✅ Database indexes created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
    return false;
  }
};

export const optimizeQueries = {
  // Optimized query for dashboard summary data
  getDashboardSummary: async (organizationId: number) => {
    try {
      const result = await db.execute(sql`
        WITH ecommerce_summary AS (
          SELECT 
            COUNT(DISTINCT p.id) as total_products,
            COUNT(DISTINCT c.id) as total_customers,
            COUNT(DISTINCT o.id) as total_orders,
            COALESCE(SUM(o.total::numeric), 0) as total_revenue
          FROM products_table p
          FULL OUTER JOIN customers_table c ON c.organization_id = ${organizationId}
          FULL OUTER JOIN orders_table o ON o.organization_id = ${organizationId}
          WHERE p.organization_id = ${organizationId}
        ),
        financial_summary AS (
          SELECT 
            COUNT(*) as portfolio_count,
            COALESCE(SUM(value::numeric), 0) as total_portfolio_value,
            COALESCE(AVG(change_percent), 0) as avg_change_percent
          FROM portfolio_holdings_table 
          WHERE organization_id = ${organizationId}
        ),
        manufacturing_summary AS (
          SELECT 
            COUNT(DISTINCT region) as active_regions,
            COALESCE(SUM(units_produced), 0) as total_units_produced,
            COALESCE(AVG(efficiency_percent), 0) as avg_efficiency
          FROM production_data_table 
          WHERE organization_id = ${organizationId}
            AND period >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
        )
        SELECT 
          e.*,
          f.portfolio_count,
          f.total_portfolio_value,
          f.avg_change_percent,
          m.active_regions,
          m.total_units_produced,
          m.avg_efficiency
        FROM ecommerce_summary e
        CROSS JOIN financial_summary f
        CROSS JOIN manufacturing_summary m
      `);
      
      return result[0] || {};
    } catch (error) {
      console.error('Error getting dashboard summary:', error);
      return {};
    }
  },

  // Optimized query for time-series data
  getTimeSeriesData: async (organizationId: number, table: string, dateColumn: string, limit: number = 30) => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM ${sql.identifier(table)}
        WHERE organization_id = ${organizationId}
        ORDER BY ${sql.identifier(dateColumn)} DESC
        LIMIT ${limit}
      `);
      
      return result;
    } catch (error) {
      console.error(`Error getting time series data from ${table}:`, error);
      return [];
    }
  },

  // Optimized query for top performers
  getTopPerformers: async (organizationId: number, table: string, valueColumn: string, limit: number = 10) => {
    try {
      const result = await db.execute(sql`
        SELECT * FROM ${sql.identifier(table)}
        WHERE organization_id = ${organizationId}
        ORDER BY ${sql.identifier(valueColumn)} DESC
        LIMIT ${limit}
      `);
      
      return result;
    } catch (error) {
      console.error(`Error getting top performers from ${table}:`, error);
      return [];
    }
  }
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Monitor query execution time
  timeQuery: async <T>(queryName: string, queryFn: () => Promise<T>): Promise<T> => {
    const startTime = Date.now();
    try {
      const result = await queryFn();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (duration > 1000) {
        console.warn(`⚠️  Slow query detected: ${queryName} took ${duration}ms`);
      } else {
        console.log(`✅ Query ${queryName} completed in ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.error(`❌ Query ${queryName} failed after ${duration}ms:`, error);
      throw error;
    }
  },

  // Cache frequently accessed data
  cache: new Map<string, { data: any; timestamp: number; ttl: number }>(),

  getCached: <T>(key: string): T | null => {
    const cached = performanceMonitor.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  },

  setCached: <T>(key: string, data: T, ttlMs: number = 300000): void => { // 5 minutes default
    performanceMonitor.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  },

  clearCache: (): void => {
    performanceMonitor.cache.clear();
  }
};

// Database maintenance utilities
export const databaseMaintenance = {
  // Clean up old data
  cleanupOldData: async (daysToKeep: number = 365) => {
    console.log(`🧹 Cleaning up data older than ${daysToKeep} days...`);
    
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      // Clean up old sales data
      await db.execute(sql`
        DELETE FROM sales_data_table 
        WHERE date < ${cutoffDate}
      `);
      
      // Clean up old system metrics
      await db.execute(sql`
        DELETE FROM system_metrics_table 
        WHERE created_at < ${cutoffDate}
      `);
      
      console.log('✅ Old data cleanup completed');
      return true;
    } catch (error) {
      console.error('❌ Error during data cleanup:', error);
      return false;
    }
  },

  // Analyze table sizes
  analyzeTableSizes: async () => {
    try {
      const result = await db.execute(sql`
        SELECT 
          schemaname,
          tablename,
          attname,
          n_distinct,
          correlation
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname
      `);
      
      console.log('📊 Table statistics:', result);
      return result;
    } catch (error) {
      console.error('❌ Error analyzing table sizes:', error);
      return [];
    }
  },

  // Update table statistics
  updateStatistics: async () => {
    try {
      await db.execute(sql`ANALYZE`);
      console.log('✅ Database statistics updated');
      return true;
    } catch (error) {
      console.error('❌ Error updating statistics:', error);
      return false;
    }
  }
};

// Batch operations for better performance
export const batchOperations = {
  // Batch insert with conflict handling
  batchInsert: async <T>(table: any, data: T[], batchSize: number = 1000) => {
    console.log(`📦 Batch inserting ${data.length} records into ${table} (batch size: ${batchSize})`);
    
    try {
      const batches = [];
      for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        await db.insert(table).values(batch).onConflictDoNothing();
      }
      
      console.log(`✅ Batch insert completed: ${data.length} records processed`);
      return true;
    } catch (error) {
      console.error('❌ Error during batch insert:', error);
      return false;
    }
  },

  // Batch update operations
  batchUpdate: async (updates: Array<{ table: any; where: any; set: any }>) => {
    console.log(`🔄 Processing ${updates.length} batch updates`);
    
    try {
      for (const update of updates) {
        await db.update(update.table).set(update.set).where(update.where);
      }
      
      console.log('✅ Batch updates completed');
      return true;
    } catch (error) {
      console.error('❌ Error during batch updates:', error);
      return false;
    }
  }
};