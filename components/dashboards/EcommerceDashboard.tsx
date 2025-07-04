'use client';

import { 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target,
  Upload,
  Clock, 
  CheckCircle,
  FileText,
  Globe
} from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// E-commerce KPIs
const ecommerceKPIs = [
  { title: 'Conversion Rate', value: '3.8%', change: '+24.1%', trend: 'up', icon: Target },
  { title: 'File Processing', value: '500MB', change: '+4900%', trend: 'up', icon: Upload },
  { title: 'Customer Segments', value: '15 Active', change: '+87%', trend: 'up', icon: Users },
  { title: 'Analysis Speed', value: '0.7s', change: '-96%', trend: 'up', icon: Clock },
];

// Sales data
const salesData = [
  { month: 'Jan', shopee: 850000, lazada: 620000, tokopedia: 540000 },
  { month: 'Feb', shopee: 920000, lazada: 680000, tokopedia: 580000 },
  { month: 'Mar', shopee: 1050000, lazada: 750000, tokopedia: 640000 },
  { month: 'Apr', shopee: 1180000, lazada: 820000, tokopedia: 710000 },
  { month: 'May', shopee: 1320000, lazada: 890000, tokopedia: 780000 },
  { month: 'Jun', shopee: 1450000, lazada: 960000, tokopedia: 850000 },
];

// Customer segments
const customerSegments = [
  { name: 'High Value', customers: 1250, revenue: 850000, color: '#10B981' },
  { name: 'Regular', customers: 4800, revenue: 1200000, color: '#3B82F6' },
  { name: 'Occasional', customers: 8900, revenue: 890000, color: '#F59E0B' },
  { name: 'New', customers: 3200, revenue: 240000, color: '#8B5CF6' },
];

// System improvements
const ecommerceImprovements = [
  { metric: 'File Upload Capacity', oldLimit: '10MB', newLimit: '500MB', improvement: '4900%', status: 'Resolved' },
  { metric: 'Customer Segmentation', oldTime: 'Failed (10MB)', newTime: '0.7 sec', improvement: '100%', status: 'Resolved' },
  { metric: 'Sales Data Import', oldTime: 'Timeout', newTime: '1.2 sec', improvement: '100%', status: 'Resolved' },
  { metric: 'Traffic Volume Processing', oldTime: 'Failed', newTime: 'Real-time', improvement: '100%', status: 'Resolved' },
];

export default function EcommerceDashboard() {
  return (
    <div className="space-y-6">
      {/* E-commerce KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ecommerceKPIs.map((kpi, index) => {
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

      {/* Multi-Platform Sales Performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Platform Sales Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="shopee" stackId="1" stroke="#EE4D2D" fill="#EE4D2D" fillOpacity={0.3} />
              <Area type="monotone" dataKey="lazada" stackId="1" stroke="#0F146D" fill="#0F146D" fillOpacity={0.3} />
              <Area type="monotone" dataKey="tokopedia" stackId="1" stroke="#42B549" fill="#42B549" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Shopee</p>
            <p className="text-xs text-gray-500">$1.45M monthly</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-800 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Lazada</p>
            <p className="text-xs text-gray-500">$960K monthly</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Tokopedia</p>
            <p className="text-xs text-gray-500">$850K monthly</p>
          </div>
        </div>
      </div>

      {/* Customer Segmentation & System Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segmentation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segmentation Analysis</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="revenue"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                  <span className="text-gray-600">{segment.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">{segment.customers.toLocaleString()}</span>
                  <span className="block text-xs text-gray-500">${segment.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Improvements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Issues RESOLVED</h3>
          <div className="space-y-4">
            {ecommerceImprovements.map((improvement, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{improvement.metric}</h4>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Before</p>
                    <p className="font-medium text-red-600">{improvement.oldLimit || improvement.oldTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Now</p>
                    <p className="font-medium text-green-600">{improvement.newLimit || improvement.newTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Improvement</p>
                    <p className="font-semibold text-blue-600">{improvement.improvement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">E-commerce Success Stories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Shopee Integration</h4>
            <p className="text-sm text-gray-600 mt-1">Customer behavior analysis now handles unlimited file sizes</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Lazada Data Import</h4>
            <p className="text-sm text-gray-600 mt-1">Sales data validation no longer times out</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Globe className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Multi-Platform Analytics</h4>
            <p className="text-sm text-gray-600 mt-1">Real-time processing across all marketplaces</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Platform-Specific Achievements</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>🛍️ Shopee: Customer segmentation module now processes 500MB+ datasets instantly</p>
            <p>🛒 Lazada: Large CSV import processing completed in under 2 seconds</p>
            <p>📱 Tokopedia: Real-time conversion tracking with zero delays</p>
            <p>🌏 Regional: Multi-channel attribution across all Southeast Asian markets</p>
          </div>
        </div>
      </div>
    </div>
  );
} 