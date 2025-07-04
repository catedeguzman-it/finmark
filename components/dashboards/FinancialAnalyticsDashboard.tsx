'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator, 
  PieChart as PieChartIcon,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Financial KPIs
const financialKPIs = [
  { title: 'Net Revenue', value: '$3.2M', change: '+15.8%', trend: 'up', icon: DollarSign },
  { title: 'Operating Margin', value: '28.4%', change: '+3.2%', trend: 'up', icon: TrendingUp },
  { title: 'Cash Flow', value: '$1.8M', change: '+22.1%', trend: 'up', icon: BarChart3 },
  { title: 'Processing Time', value: '1.2s', change: '-89%', trend: 'up', icon: Clock },
];

// Multi-currency revenue data addressing international clients
const currencyRevenueData = [
  { month: 'Jan', USD: 180000, SGD: 245000, MYR: 756000, THB: 5940000, IDR: 2570000000 },
  { month: 'Feb', USD: 220000, SGD: 298000, MYR: 924000, THB: 7260000, IDR: 3140000000 },
  { month: 'Mar', USD: 250000, SGD: 338000, MYR: 1050000, THB: 8250000, IDR: 3570000000 },
  { month: 'Apr', USD: 280000, SGD: 378000, MYR: 1176000, THB: 9240000, IDR: 3990000000 },
  { month: 'May', USD: 320000, SGD: 432000, MYR: 1344000, THB: 10560000, IDR: 4560000000 },
  { month: 'Jun', USD: 350000, SGD: 472500, MYR: 1470000, THB: 11550000, IDR: 4980000000 },
];

// Financial ratios and metrics for different client sectors
const sectorAnalysis = [
  { sector: 'Manufacturing', revenue: 1250000, margin: 32.5, roi: 18.7, clients: 145 },
  { sector: 'Healthcare', revenue: 980000, margin: 28.9, roi: 22.3, clients: 89 },
  { sector: 'E-commerce', revenue: 850000, margin: 25.1, roi: 35.2, clients: 167 },
  { sector: 'Retail', revenue: 720000, margin: 22.8, roi: 16.9, clients: 203 },
  { sector: 'SME', revenue: 650000, margin: 19.5, roi: 24.1, clients: 312 },
];

// Cash flow analysis
const cashFlowData = [
  { month: 'Jan', operating: 150000, investing: -45000, financing: 20000, net: 125000 },
  { month: 'Feb', operating: 180000, investing: -30000, financing: 15000, net: 165000 },
  { month: 'Mar', operating: 220000, investing: -60000, financing: 25000, net: 185000 },
  { month: 'Apr', operating: 250000, investing: -40000, financing: 10000, net: 220000 },
  { month: 'May', operating: 280000, investing: -55000, financing: 30000, net: 255000 },
  { month: 'Jun', operating: 320000, investing: -70000, financing: 20000, net: 270000 },
];

// Portfolio breakdown
const portfolioData = [
  { name: 'Equities', value: 45, amount: 1580000, color: '#3B82F6' },
  { name: 'Fixed Income', value: 25, amount: 875000, color: '#10B981' },
  { name: 'Real Estate', value: 15, amount: 525000, color: '#F59E0B' },
  { name: 'Commodities', value: 10, amount: 350000, color: '#EF4444' },
  { name: 'Cash', value: 5, amount: 175000, color: '#8B5CF6' },
];

// Financial forecasting data
const forecastData = [
  { period: 'Q3 2024', actual: 950000, forecast: null, variance: null },
  { period: 'Q4 2024', actual: 1050000, forecast: 1020000, variance: 2.9 },
  { period: 'Q1 2025', actual: null, forecast: 1150000, variance: null },
  { period: 'Q2 2025', actual: null, forecast: 1280000, variance: null },
  { period: 'Q3 2025', actual: null, forecast: 1420000, variance: null },
  { period: 'Q4 2025', actual: null, forecast: 1580000, variance: null },
];

// Recent calculation improvements
const calculationMetrics = [
  { metric: 'ROI Analysis', oldTime: '15 min', newTime: '1.2 sec', improvement: '99.9%', status: 'optimized' },
  { metric: 'Portfolio Rebalancing', oldTime: '8 min', newTime: '0.8 sec', improvement: '99.8%', status: 'optimized' },
  { metric: 'Risk Assessment', oldTime: '12 min', newTime: '1.5 sec', improvement: '99.8%', status: 'optimized' },
  { metric: 'Financial Projections', oldTime: '20 min', newTime: '2.1 sec', improvement: '99.8%', status: 'optimized' },
];

export default function FinancialAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {financialKPIs.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositive = kpi.trend === 'up';
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Icon className={`h-5 w-5 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Currency Revenue & Cash Flow Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Currency Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Currency Revenue Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currencyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'USD') return [`$${value.toLocaleString()}`, 'USD'];
                    if (name === 'SGD') return [`S$${value.toLocaleString()}`, 'SGD'];
                    if (name === 'MYR') return [`RM${value.toLocaleString()}`, 'MYR'];
                    if (name === 'THB') return [`฿${value.toLocaleString()}`, 'THB'];
                    if (name === 'IDR') return [`Rp${value.toLocaleString()}`, 'IDR'];
                    return [value, name];
                  }}
                />
                <Line type="monotone" dataKey="USD" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="SGD" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="MYR" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Analysis</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Bar dataKey="operating" fill="#10B981" name="Operating CF" />
                <Bar dataKey="investing" fill="#EF4444" name="Investing CF" />
                <Bar dataKey="financing" fill="#3B82F6" name="Financing CF" />
                <Line type="monotone" dataKey="net" stroke="#8B5CF6" strokeWidth={3} name="Net CF" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sector Analysis & Portfolio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Performance Analysis</h3>
          <div className="space-y-4">
            {sectorAnalysis.map((sector, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{sector.sector}</h4>
                  <span className="text-sm text-gray-500">{sector.clients} clients</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold">${sector.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Margin</p>
                    <p className="font-semibold text-green-600">{sector.margin}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">ROI</p>
                    <p className="font-semibold text-blue-600">{sector.roi}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{item.value}%</span>
                  <span className="block text-xs text-gray-500">${item.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Forecasting & Calculation Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Forecasting */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Forecasting</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value?.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="actual" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="forecast" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calculation Performance Improvements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Performance</h3>
          <div className="space-y-4">
            {calculationMetrics.map((metric, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Before</p>
                    <p className="font-medium text-red-600">{metric.oldTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Now</p>
                    <p className="font-medium text-green-600">{metric.newTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Improvement</p>
                    <p className="font-semibold text-blue-600">{metric.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Assessment & Compliance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment & Compliance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Credit Risk</h4>
            <p className="text-sm text-gray-600 mt-1">Low risk profile</p>
            <p className="text-lg font-bold text-green-600 mt-2">2.3%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Market Risk</h4>
            <p className="text-sm text-gray-600 mt-1">Moderate exposure</p>
            <p className="text-lg font-bold text-blue-600 mt-2">8.7%</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900">Operational Risk</h4>
            <p className="text-sm text-gray-600 mt-1">Well controlled</p>
            <p className="text-lg font-bold text-yellow-600 mt-2">4.1%</p>
          </div>
        </div>
      </div>
    </div>
  );
} 