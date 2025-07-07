import { db } from '@/db';
import {
  productsTable,
  customersTable,
  ordersTable,
  portfolioHoldingsTable,
  financialMetricsTable,
  currencyRatesTable,
  productionDataTable,
  supplyChainMetricsTable,
  systemMetricsTable,
  cashFlowDataTable,
  salesDataTable,
} from '@/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';

// E-commerce Dashboard Data
export const getEcommerceData = async (organizationId: number) => {
  try {
    const [products, customers, orders, salesData] = await Promise.all([
      // Top products by revenue (price * sold)
      db.select().from(productsTable)
        .where(eq(productsTable.organizationId, organizationId))
        .orderBy(desc(productsTable.sold))
        .limit(20),
      
      // Top customers by total spent
      db.select().from(customersTable)
        .where(eq(customersTable.organizationId, organizationId))
        .orderBy(desc(customersTable.totalSpent))
        .limit(15),
      
      // Recent orders
      db.select().from(ordersTable)
        .where(eq(ordersTable.organizationId, organizationId))
        .orderBy(desc(ordersTable.orderDate))
        .limit(25),
      
      // Sales data for last 30 days
      db.select().from(salesDataTable)
        .where(and(
          eq(salesDataTable.organizationId, organizationId),
          gte(salesDataTable.date, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        ))
        .orderBy(desc(salesDataTable.date))
    ]);

    return {
      products,
      customers,
      orders,
      salesData,
    };
  } catch (error) {
    console.error('Error fetching e-commerce data:', error);
    return {
      products: [],
      customers: [],
      orders: [],
      salesData: [],
    };
  }
};

// Financial Analytics Dashboard Data
export const getFinancialData = async (organizationId: number) => {
  try {
    const [portfolioHoldings, financialMetrics, cashFlowData, currencyRates] = await Promise.all([
      // Portfolio holdings sorted by value
      db.select().from(portfolioHoldingsTable)
        .where(eq(portfolioHoldingsTable.organizationId, organizationId))
        .orderBy(desc(portfolioHoldingsTable.value))
        .limit(15),
      
      // Financial metrics for last 12 months
      db.select().from(financialMetricsTable)
        .where(and(
          eq(financialMetricsTable.organizationId, organizationId),
          eq(financialMetricsTable.metricType, 'monthly')
        ))
        .orderBy(desc(financialMetricsTable.period))
        .limit(12),
      
      // Cash flow data for last 24 months
      db.select().from(cashFlowDataTable)
        .where(eq(cashFlowDataTable.organizationId, organizationId))
        .orderBy(desc(cashFlowDataTable.period))
        .limit(24),
      
      // All currency rates
      db.select().from(currencyRatesTable)
    ]);

    return {
      portfolioHoldings,
      financialMetrics,
      cashFlowData,
      currencyRates,
    };
  } catch (error) {
    console.error('Error fetching financial data:', error);
    return {
      portfolioHoldings: [],
      financialMetrics: [],
      cashFlowData: [],
      currencyRates: [],
    };
  }
};

// Manufacturing Dashboard Data
export const getManufacturingData = async (organizationId: number) => {
  try {
    const [productionData, supplyChainMetrics] = await Promise.all([
      // Production data for last 6 months across all regions
      db.select().from(productionDataTable)
        .where(eq(productionDataTable.organizationId, organizationId))
        .orderBy(desc(productionDataTable.period))
        .limit(36), // 6 months × 6 regions
      
      // Supply chain metrics for last 8 weeks
      db.select().from(supplyChainMetricsTable)
        .where(eq(supplyChainMetricsTable.organizationId, organizationId))
        .orderBy(desc(supplyChainMetricsTable.week))
        .limit(8)
    ]);

    return {
      productionData,
      supplyChainMetrics,
    };
  } catch (error) {
    console.error('Error fetching manufacturing data:', error);
    return {
      productionData: [],
      supplyChainMetrics: [],
    };
  }
};

// Executive Overview Dashboard Data
export const getExecutiveData = async (organizationId: number) => {
  try {
    const [systemMetrics, recentFinancialMetrics, recentProductionData] = await Promise.all([
      // All system metrics
      db.select().from(systemMetricsTable)
        .where(eq(systemMetricsTable.organizationId, organizationId))
        .orderBy(desc(systemMetricsTable.updatedAt)),
      
      // Recent financial metrics (last 6 months)
      db.select().from(financialMetricsTable)
        .where(and(
          eq(financialMetricsTable.organizationId, organizationId),
          eq(financialMetricsTable.metricType, 'monthly')
        ))
        .orderBy(desc(financialMetricsTable.period))
        .limit(6),
      
      // Recent production data for regional performance
      db.select().from(productionDataTable)
        .where(eq(productionDataTable.organizationId, organizationId))
        .orderBy(desc(productionDataTable.period))
        .limit(6) // Latest month for all regions
    ]);

    return {
      systemMetrics,
      recentFinancialMetrics,
      recentProductionData,
    };
  } catch (error) {
    console.error('Error fetching executive data:', error);
    return {
      systemMetrics: [],
      recentFinancialMetrics: [],
      recentProductionData: [],
    };
  }
};

// Generic function to get dashboard data by type
export const getDashboardData = async (dashboardType: string, organizationId: number) => {
  switch (dashboardType) {
    case 'ecommerce':
      return await getEcommerceData(organizationId);
    case 'financial':
      return await getFinancialData(organizationId);
    case 'manufacturing':
      return await getManufacturingData(organizationId);
    case 'overview':
      return await getExecutiveData(organizationId);
    default:
      console.warn(`Unknown dashboard type: ${dashboardType}`);
      return {};
  }
};

// Utility function to calculate metrics from raw data
export const calculateDashboardMetrics = (dashboardType: string, data: any) => {
  switch (dashboardType) {
    case 'ecommerce':
      return calculateEcommerceMetrics(data);
    case 'financial':
      return calculateFinancialMetrics(data);
    case 'manufacturing':
      return calculateManufacturingMetrics(data);
    case 'overview':
      return calculateExecutiveMetrics(data);
    default:
      return {};
  }
};

const calculateEcommerceMetrics = (data: any) => {
  const { products, customers, orders } = data;
  
  const totalRevenue = products.reduce((sum: number, product: any) => 
    sum + (parseFloat(product.price) * product.sold), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = orders.reduce((sum: number, order: any) => 
    sum + parseFloat(order.total), 0) / totalOrders;

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    avgOrderValue,
  };
};

const calculateFinancialMetrics = (data: any) => {
  const { portfolioHoldings, financialMetrics } = data;
  
  const totalPortfolioValue = portfolioHoldings.reduce((sum: number, holding: any) => 
    sum + parseFloat(holding.value), 0);
  const totalRevenue = financialMetrics.reduce((sum: number, metric: any) => 
    sum + parseFloat(metric.revenue), 0);
  const totalProfit = financialMetrics.reduce((sum: number, metric: any) => 
    sum + parseFloat(metric.profit), 0);
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    totalPortfolioValue,
    totalRevenue,
    totalProfit,
    profitMargin,
  };
};

const calculateManufacturingMetrics = (data: any) => {
  const { productionData, supplyChainMetrics } = data;
  
  const totalUnitsProduced = productionData.reduce((sum: number, prod: any) => 
    sum + prod.unitsProduced, 0);
  const avgEfficiency = productionData.reduce((sum: number, prod: any) => 
    sum + prod.efficiencyPercent, 0) / productionData.length;
  const avgOnTimeDelivery = supplyChainMetrics.reduce((sum: number, metric: any) => 
    sum + metric.onTimePercent, 0) / supplyChainMetrics.length;

  return {
    totalUnitsProduced,
    avgEfficiency,
    avgOnTimeDelivery,
  };
};

const calculateExecutiveMetrics = (data: any) => {
  const { systemMetrics, recentFinancialMetrics } = data;
  
  const systemUptime = systemMetrics.find((m: any) => m.metricName === 'System Uptime')?.currentValue || 'N/A';
  const responseTime = systemMetrics.find((m: any) => m.metricName === 'Average Response Time')?.currentValue || 'N/A';
  const totalRevenue = recentFinancialMetrics.reduce((sum: number, metric: any) => 
    sum + parseFloat(metric.revenue), 0);

  return {
    systemUptime,
    responseTime,
    totalRevenue,
  };
};