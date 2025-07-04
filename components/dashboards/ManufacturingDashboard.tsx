'use client';

import { 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Users
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Manufacturing KPIs
const manufacturingKPIs = [
  { title: 'Production Efficiency', value: '94.2%', change: '+18.7%', trend: 'up', icon: Factory },
  { title: 'Supply Chain Score', value: '92.8%', change: '+25.3%', trend: 'up', icon: Truck },
  { title: 'Inventory Turnover', value: '8.4x', change: '+12.9%', trend: 'up', icon: Package },
  { title: 'Processing Speed', value: '0.6s', change: '-85%', trend: 'up', icon: Clock },
];

// Production data across regions
const productionData = [
  { month: 'Jan', thailand: 85000, indonesia: 78000, malaysia: 82000, vietnam: 75000 },
  { month: 'Feb', thailand: 88000, indonesia: 81000, malaysia: 85000, vietnam: 78000 },
  { month: 'Mar', thailand: 92000, indonesia: 85000, malaysia: 88000, vietnam: 82000 },
  { month: 'Apr', thailand: 95000, indonesia: 88000, malaysia: 91000, vietnam: 85000 },
  { month: 'May', thailand: 98000, indonesia: 92000, malaysia: 94000, vietnam: 88000 },
  { month: 'Jun', thailand: 102000, indonesia: 95000, malaysia: 97000, vietnam: 92000 },
];

// Supply chain performance
const supplyChainData = [
  { week: 'Week 1', onTime: 92, quality: 96, cost: 88, efficiency: 91 },
  { week: 'Week 2', onTime: 94, quality: 97, cost: 89, efficiency: 93 },
  { week: 'Week 3', onTime: 96, quality: 98, cost: 91, efficiency: 95 },
  { week: 'Week 4', onTime: 98, quality: 99, cost: 93, efficiency: 97 },
];

// System performance improvements
const systemImprovements = [
  { metric: 'Resource Allocation Analysis', oldTime: '15+ min', newTime: '0.6 sec', improvement: '99.9%', status: 'Fixed' },
  { metric: 'Supply Chain Analytics', oldTime: '6 hours', newTime: '1.2 sec', improvement: '99.9%', status: 'Fixed' },
  { metric: 'Inventory Optimization', oldTime: 'Lost work', newTime: 'Real-time', improvement: '100%', status: 'Fixed' },
  { metric: 'Multi-Tier Data Processing', oldTime: 'Failed', newTime: '0.8 sec', improvement: '100%', status: 'Fixed' },
];

export default function ManufacturingDashboard() {
  return (
    <div className="space-y-6">
      {/* Manufacturing KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {manufacturingKPIs.map((kpi, index) => {
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

      {/* Production Performance Across Regions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Production Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number) => [`${value.toLocaleString()} units`, '']}
              />
              <Area type="monotone" dataKey="thailand" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="indonesia" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="malaysia" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
              <Area type="monotone" dataKey="vietnam" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Thailand</p>
            <p className="text-xs text-gray-500">102K units/month</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Indonesia</p>
            <p className="text-xs text-gray-500">95K units/month</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Malaysia</p>
            <p className="text-xs text-gray-500">97K units/month</p>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <p className="text-sm font-medium">Vietnam</p>
            <p className="text-xs text-gray-500">92K units/month</p>
          </div>
        </div>
      </div>

      {/* Supply Chain & System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supply Chain Analytics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply Chain Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={supplyChainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#666" />
                <YAxis domain={[80, 100]} stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Line type="monotone" dataKey="onTime" stroke="#3B82F6" strokeWidth={3} name="On-Time Delivery" />
                <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={3} name="Quality Score" />
                <Line type="monotone" dataKey="cost" stroke="#F59E0B" strokeWidth={3} name="Cost Efficiency" />
                <Line type="monotone" dataKey="efficiency" stroke="#8B5CF6" strokeWidth={3} name="Overall Efficiency" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Performance Improvements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Issues RESOLVED</h3>
          <div className="space-y-4">
            {systemImprovements.map((improvement, index) => (
              <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{improvement.metric}</h4>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {improvement.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Before</p>
                    <p className="font-medium text-red-600">{improvement.oldTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Now</p>
                    <p className="font-medium text-green-600">{improvement.newTime}</p>
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

      {/* Manufacturing Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Factory className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Factory Efficiency</h4>
            <p className="text-lg font-bold text-blue-600 mt-1">94.2%</p>
            <p className="text-xs text-gray-500">Real-time monitoring active</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Settings className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Equipment Uptime</h4>
            <p className="text-lg font-bold text-green-600 mt-1">98.7%</p>
            <p className="text-xs text-gray-500">Predictive maintenance</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Workforce Productivity</h4>
            <p className="text-lg font-bold text-purple-600 mt-1">96.1%</p>
            <p className="text-xs text-gray-500">Optimized scheduling</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Success Stories</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>✅ Vietnamese factory efficiency analysis no longer crashes</p>
            <p>✅ Supply chain analytics completed in seconds, not hours</p>
            <p>✅ Multi-tier supplier data processing now handles unlimited volume</p>
            <p>✅ Automotive parts manufacturing ROI calculations instant</p>
          </div>
        </div>
      </div>
    </div>
  );
} 