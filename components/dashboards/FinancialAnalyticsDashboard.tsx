'use client';

import React from 'react';
import { faker } from '@faker-js/faker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart as PieChartIcon,
  Wallet,
  CreditCard,
  Building,
  FileText,
  Download,
  Plus,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
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

const generateTransactionsData = () => {
  return Array.from({ length: 20 }, () => ({
    id: faker.string.alphanumeric(10).toUpperCase(),
    type: faker.helpers.arrayElement(['Income', 'Expense', 'Investment', 'Withdrawal']),
    description: faker.finance.transactionDescription(),
    amount: faker.number.float({ min: 100, max: 50000, fractionDigits: 2 }),
    category: faker.helpers.arrayElement(['Operations', 'Marketing', 'R&D', 'Investments', 'Salary', 'Revenue']),
    date: faker.date.recent({ days: 30 }),
    status: faker.helpers.arrayElement(['Completed', 'Pending', 'Failed']),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'SGD', 'MYR'])
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

const currencies = [
  { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.85, name: 'Euro' },
  { code: 'SGD', symbol: 'S$', rate: 1.35, name: 'Singapore Dollar' },
  { code: 'MYR', symbol: 'RM', rate: 4.50, name: 'Malaysian Ringgit' }
];

export default function FinancialAnalyticsDashboard() {
  const revenueData = generateRevenueData();
  const portfolioData = generatePortfolioData().sort((a, b) => b.value - a.value);
  const transactionData = generateTransactionsData().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const cashFlowData = generateCashFlowData();

  // Calculate key metrics
  const totalPortfolioValue = portfolioData.reduce((sum, item) => sum + item.value, 0);
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgMonthlyRevenue = totalRevenue / revenueData.length;
  const profitMargin = (totalProfit / totalRevenue) * 100;

  const getTransactionBadge = (type: string) => {
    const variants: Record<string, string> = {
      'Income': 'bg-green-100 text-green-800',
      'Expense': 'bg-red-100 text-red-800',
      'Investment': 'bg-blue-100 text-blue-800',
      'Withdrawal': 'bg-orange-100 text-orange-800'
    };
    
    return (
      <Badge className={variants[type] || ''}>
        {type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status] || ''}>
        {status}
      </Badge>
    );
  };

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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    const currencyInfo = currencies.find(c => c.code === currency);
    return `${currencyInfo?.symbol || '$'}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial insights and portfolio management</p>
        </div>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +8.2% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +12.5% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              +2.3% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Revenue</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              Consistent growth
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit over the year</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Portfolio distribution across asset classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
          <CardDescription>24-month cash flow trend showing inflows, outflows, and net position</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
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
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Tables */}
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolio">Portfolio Holdings</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="currencies">Currency Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Current investment positions and performance</CardDescription>
            </CardHeader>
            <CardContent>
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
                  {portfolioData.slice(0, 10).map((holding) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial transactions and movements</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData.slice(0, 12).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                      <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">{transaction.date.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle>Currency Exchange Rates</CardTitle>
              <CardDescription>Current exchange rates for multi-currency operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Rate (vs USD)</TableHead>
                    <TableHead className="text-right">24h Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.map((currency) => {
                    const change = faker.number.float({ min: -2, max: 2, fractionDigits: 2 });
                    return (
                      <TableRow key={currency.code}>
                        <TableCell className="font-medium">{currency.name}</TableCell>
                        <TableCell>{currency.code}</TableCell>
                        <TableCell className="font-semibold">{currency.symbol}</TableCell>
                        <TableCell className="text-right">{currency.rate.toFixed(4)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`flex items-center justify-end gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {Math.abs(change).toFixed(2)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 