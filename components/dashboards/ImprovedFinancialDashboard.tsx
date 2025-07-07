'use client';

import React from 'react';
import { faker } from '@faker-js/faker';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/ui/metric-card';
import { ChartCard } from '@/components/ui/chart-card';
import { ChartWrapper } from '@/components/ui/chart-wrapper';
import { DashboardGrid, DashboardSection } from '@/components/ui/dashboard-grid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Activity,
  Building,
  Download,
  Plus
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  Line
} from 'recharts';

// Generate dummy financial data
const generateRevenueData = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
    return {
      month,
      revenue: faker.number.int({ min: 150000, max: 300000 }),
      expenses: faker.number.int({ min: 80000, max: 150000 }),
      profit: 0,
      target: faker.number.int({ min: 200000, max: 280000 })
    };
  }).map(item => ({
    ...item,
    profit: item.revenue - item.expenses
  }));
};

const generatePortfolioData = () => {
  return Array.from({ length: 15 }, () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    type: faker.helpers.arrayElement(['Equity', 'Bonds', 'Real Estate', 'Commodities', 'Crypto']),
    value: faker.number.float({ min: 10000, max: 500000, fractionDigits: 2 }),
    change: faker.number.float({ min: -15, max: 20, fractionDigits: 2 }),
    allocation: faker.number.float({ min: 5, max: 25, fractionDigits: 1 }),
    risk: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    manager: faker.person.fullName(),
    lastUpdated: faker.date.recent({ days: 7 })
  }));
};

const generateCashFlowData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (23 - i));
    return {
      period: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      inflow: faker.number.int({ min: 80000, max: 200000 }),
      outflow: faker.number.int({ min: 60000, max: 180000 }),
      net: 0
    };
  }).map(item => ({
    ...item,
    net: item.inflow - item.outflow
  }));
};

const assetAllocationData = [
  { name: 'Equities', value: 45, color: '#3b82f6' },
  { name: 'Bonds', value: 25, color: '#10b981' },
  { name: 'Real Estate', value: 15, color: '#f59e0b' },
  { name: 'Commodities', value: 10, color: '#ef4444' },
  { name: 'Cash', value: 5, color: '#6b7280' }
];

export default function ImprovedFinancialDashboard() {
  const revenueData = generateRevenueData();
  const portfolioData = generatePortfolioData().sort((a, b) => b.value - a.value);
  const cashFlowData = generateCashFlowData();

  // Calculate key metrics
  const totalPortfolioValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgMonthlyRevenue = totalRevenue / revenueData.length;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[risk] || ''}>
        {risk}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <DashboardSection
        title="Financial Analytics"
        description="Comprehensive financial insights and portfolio management"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="size-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <Plus className="size-4 mr-2" />
              New Investment
            </Button>
          </div>
        }
      >
        <div></div>
      </DashboardSection>

      {/* Key Metrics */}
      <DashboardGrid cols={{ default: 1, md: 2, lg: 4 }}>
        <MetricCard
          title="Total Portfolio Value"
          value={`$${totalPortfolioValue.toLocaleString()}`}
          icon={Wallet}
          trend={{
            value: 8.2,
            label: "from last quarter",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Annual Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{
            value: 12.5,
            label: "from last year",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={Activity}
          trend={{
            value: 2.3,
            label: "from last year",
            direction: 'up'
          }}
        />
        
        <MetricCard
          title="Avg Monthly Revenue"
          value={`$${avgMonthlyRevenue.toLocaleString()}`}
          icon={Building}
          description="Consistent growth"
        />
      </DashboardGrid>

      {/* Charts Section */}
      <DashboardGrid cols={{ default: 1, lg: 2 }}>
        <ChartCard
          title="Revenue & Profit Trend"
          description="Monthly revenue, expenses, and profit over the year"
          actions={{
            onExport: () => console.log('Export revenue chart'),
            onExpand: () => console.log('Expand revenue chart')
          }}
        >
          <ChartWrapper>
            <ComposedChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="Profit" />
            </ComposedChart>
          </ChartWrapper>
        </ChartCard>

        <ChartCard
          title="Asset Allocation"
          description="Portfolio distribution across asset classes"
          badge={{ text: "Updated", variant: "outline" }}
        >
          <ChartWrapper>
            <PieChart>
              <Pie
                data={assetAllocationData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartWrapper>
        </ChartCard>
      </DashboardGrid>

      {/* Cash Flow Chart */}
      <ChartCard
        title="Cash Flow Analysis"
        description="24-month cash flow trend showing inflows, outflows, and net position"
        size="lg"
      >
        <ChartWrapper height={400}>
          <AreaChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
            <Legend />
            <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10b981" fill="#10b981" name="Inflow" />
            <Area type="monotone" dataKey="outflow" stackId="2" stroke="#ef4444" fill="#ef4444" name="Outflow" />
            <Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} name="Net Cash Flow" />
          </AreaChart>
        </ChartWrapper>
      </ChartCard>

      {/* Portfolio Holdings Table */}
      <DashboardSection title="Portfolio Holdings" description="Current investment positions and performance">
        <ChartCard title="Top Holdings" description="Ranked by portfolio value" autoHeight>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Allocation</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.slice(0, 8).map((holding) => (
                  <TableRow key={holding.id}>
                    <TableCell className="font-medium">{holding.name}</TableCell>
                    <TableCell>{holding.type}</TableCell>
                    <TableCell>{holding.manager}</TableCell>
                    <TableCell className="text-right font-semibold">${holding.value.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{holding.allocation}%</TableCell>
                    <TableCell className="text-right">
                      <span className={`flex items-center justify-end gap-1 ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(holding.change).toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>{getRiskBadge(holding.risk)}</TableCell>
                    <TableCell className="text-right">{holding.lastUpdated.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ChartCard>
      </DashboardSection>
    </div>
  );
}