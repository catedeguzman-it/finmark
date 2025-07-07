import { db } from '@/db';
import {
  organizationsTable,
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
import { faker } from '@faker-js/faker';

export const seedComprehensiveData = async (organizationId: number) => {
  console.log(`Starting comprehensive data seeding for organization ${organizationId}...`);

  try {
    // Seed Currency Rates (global data)
    await seedCurrencyRates();
    
    // Seed E-commerce Data
    await seedEcommerceData(organizationId);
    
    // Seed Financial Analytics Data
    await seedFinancialData(organizationId);
    
    // Seed Manufacturing Data
    await seedManufacturingData(organizationId);
    
    // Seed System Performance Data
    await seedSystemMetrics(organizationId);
    
    console.log(`✅ Comprehensive data seeding completed for organization ${organizationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding comprehensive data:', error);
    return false;
  }
};

// Currency Rates (Global Data)
const seedCurrencyRates = async () => {
  const currencies = [
    { currencyCode: 'USD', rateToUsd: 1.0, symbol: '$', name: 'US Dollar' },
    { currencyCode: 'EUR', rateToUsd: 0.85, symbol: '€', name: 'Euro' },
    { currencyCode: 'SGD', rateToUsd: 1.35, symbol: 'S$', name: 'Singapore Dollar' },
    { currencyCode: 'MYR', rateToUsd: 4.50, symbol: 'RM', name: 'Malaysian Ringgit' },
    { currencyCode: 'THB', rateToUsd: 35.20, symbol: '฿', name: 'Thai Baht' },
    { currencyCode: 'IDR', rateToUsd: 15800, symbol: 'Rp', name: 'Indonesian Rupiah' },
  ];

  await db.insert(currencyRatesTable).values(currencies).onConflictDoNothing();
};

// E-commerce Data
const seedEcommerceData = async (organizationId: number) => {
  console.log('Seeding e-commerce data...');
  
  // Generate Products
  const platforms = ['Shopee', 'Lazada', 'Tokopedia'];
  const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive'];
  
  const products = Array.from({ length: 100 }, () => ({
    organizationId,
    name: faker.commerce.productName(),
    category: faker.helpers.arrayElement(categories),
    price: faker.commerce.price({ min: 10, max: 500 }),
    stock: faker.number.int({ min: 0, max: 200 }),
    rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    platform: faker.helpers.arrayElement(platforms),
    sold: faker.number.int({ min: 50, max: 1000 }),
  }));

  await db.insert(productsTable).values(products);

  // Generate Customers
  const segments = ['VIP', 'Regular', 'New', 'At Risk'];
  const customers = Array.from({ length: 200 }, () => ({
    organizationId,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    segment: faker.helpers.arrayElement(segments),
    totalOrders: faker.number.int({ min: 1, max: 50 }),
    totalSpent: faker.commerce.price({ min: 100, max: 5000 }),
    platform: faker.helpers.arrayElement(platforms),
    lastOrder: faker.date.recent({ days: 30 }),
  }));

  const insertedCustomers = await db.insert(customersTable).values(customers).returning({ id: customersTable.id });

  // Generate Orders
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const orders = Array.from({ length: 500 }, (_, index) => ({
    organizationId,
    customerId: faker.helpers.arrayElement(insertedCustomers).id,
    orderNumber: `ORD-${String(index + 1).padStart(6, '0')}`,
    total: faker.commerce.price({ min: 25, max: 500 }),
    status: faker.helpers.arrayElement(statuses),
    itemsCount: faker.number.int({ min: 1, max: 5 }),
    platform: faker.helpers.arrayElement(platforms),
    orderDate: faker.date.recent({ days: 90 }),
  }));

  await db.insert(ordersTable).values(orders);

  // Generate Sales Data (daily for last 90 days)
  const salesData: Array<{
    organizationId: number;
    date: Date;
    platform: string;
    sales: string;
  }> = [];
  
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    platforms.forEach(platform => {
      salesData.push({
        organizationId,
        date,
        platform,
        sales: faker.commerce.price({ min: 1000, max: 10000 }),
      });
    });
  }

  await db.insert(salesDataTable).values(salesData);
};

// Financial Analytics Data
const seedFinancialData = async (organizationId: number) => {
  console.log('Seeding financial data...');
  
  // Generate Portfolio Holdings
  const assetTypes = ['Equity', 'Bonds', 'Real Estate', 'Commodities', 'Crypto'];
  const riskLevels = ['Low', 'Medium', 'High'];
  
  const portfolioHoldings = Array.from({ length: 25 }, () => ({
    organizationId,
    name: faker.company.name(),
    type: faker.helpers.arrayElement(assetTypes),
    value: faker.commerce.price({ min: 10000, max: 500000 }),
    allocationPercent: faker.number.float({ min: 2, max: 15, fractionDigits: 1 }),
    changePercent: faker.number.float({ min: -15, max: 20, fractionDigits: 2 }),
    riskLevel: faker.helpers.arrayElement(riskLevels),
    manager: faker.person.fullName(),
  }));

  await db.insert(portfolioHoldingsTable).values(portfolioHoldings);

  // Generate Financial Metrics (monthly for last 24 months)
  const financialMetrics = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const period = date.toISOString().slice(0, 7); // YYYY-MM format
    
    const revenue = faker.number.int({ min: 150000, max: 300000 });
    const expenses = faker.number.int({ min: 80000, max: 150000 });
    
    financialMetrics.push({
      organizationId,
      metricType: 'monthly',
      period,
      revenue: revenue.toString(),
      expenses: expenses.toString(),
      profit: (revenue - expenses).toString(),
      target: faker.number.int({ min: 200000, max: 280000 }).toString(),
    });
  }

  await db.insert(financialMetricsTable).values(financialMetrics);

  // Generate Cash Flow Data (monthly for last 24 months)
  const cashFlowData = [];
  for (let i = 0; i < 24; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const period = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    const inflow = faker.number.int({ min: 80000, max: 200000 });
    const outflow = faker.number.int({ min: 60000, max: 180000 });
    
    cashFlowData.push({
      organizationId,
      period,
      inflow: inflow.toString(),
      outflow: outflow.toString(),
      netCashFlow: (inflow - outflow).toString(),
    });
  }

  await db.insert(cashFlowDataTable).values(cashFlowData);
};

// Manufacturing Data
const seedManufacturingData = async (organizationId: number) => {
  console.log('Seeding manufacturing data...');
  
  // Generate Production Data (monthly for last 12 months across regions)
  const regions = ['Thailand', 'Indonesia', 'Malaysia', 'Vietnam', 'Philippines', 'Singapore'];
  const productionData: Array<{
    organizationId: number;
    region: string;
    period: string;
    unitsProduced: number;
    efficiencyPercent: number;
  }> = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const period = date.toISOString().slice(0, 7); // YYYY-MM format
    
    regions.forEach(region => {
      productionData.push({
        organizationId,
        region,
        period,
        unitsProduced: faker.number.int({ min: 75000, max: 105000 }),
        efficiencyPercent: faker.number.float({ min: 85, max: 98, fractionDigits: 1 }),
      });
    });
  }

  await db.insert(productionDataTable).values(productionData);

  // Generate Supply Chain Metrics (weekly for last 8 weeks)
  const supplyChainData = [];
  for (let i = 1; i <= 8; i++) {
    supplyChainData.push({
      organizationId,
      week: `Week ${i}`,
      onTimePercent: faker.number.float({ min: 88, max: 99, fractionDigits: 1 }),
      qualityPercent: faker.number.float({ min: 92, max: 99, fractionDigits: 1 }),
      costEfficiency: faker.number.float({ min: 85, max: 95, fractionDigits: 1 }),
      overallEfficiency: faker.number.float({ min: 88, max: 97, fractionDigits: 1 }),
    });
  }

  await db.insert(supplyChainMetricsTable).values(supplyChainData);
};

// System Performance Data
const seedSystemMetrics = async (organizationId: number) => {
  console.log('Seeding system metrics...');
  
  const systemMetrics = [
    {
      organizationId,
      metricName: 'System Uptime',
      currentValue: '99.8%',
      previousValue: '85.2%',
      improvementPercent: 17.1,
      status: 'operational',
    },
    {
      organizationId,
      metricName: 'Average Response Time',
      currentValue: '0.8s',
      previousValue: '15+ min',
      improvementPercent: 99.9,
      status: 'operational',
    },
    {
      organizationId,
      metricName: 'File Upload Capacity',
      currentValue: '500MB',
      previousValue: '10MB',
      improvementPercent: 4900,
      status: 'operational',
    },
    {
      organizationId,
      metricName: 'Processing Speed',
      currentValue: '0.6s',
      previousValue: '6 hours',
      improvementPercent: 99.9,
      status: 'operational',
    },
    {
      organizationId,
      metricName: 'Data Processing Reliability',
      currentValue: '100%',
      previousValue: 'Failed',
      improvementPercent: 100,
      status: 'operational',
    },
  ];

  await db.insert(systemMetricsTable).values(systemMetrics);
};

// Utility function to seed data for multiple organizations
export const seedAllOrganizations = async () => {
  console.log('Starting comprehensive data seeding for all organizations...');
  
  try {
    // Get all organizations
    const organizations = await db.select({ id: organizationsTable.id }).from(organizationsTable);
    
    for (const org of organizations) {
      await seedComprehensiveData(org.id);
    }
    
    console.log('✅ All organizations seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding all organizations:', error);
    return false;
  }
};