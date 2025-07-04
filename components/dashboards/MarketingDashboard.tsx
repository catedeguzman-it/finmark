'use client';

import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  MousePointer, 
  Clock, 
  CheckCircle,
  Megaphone,
  Eye
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Marketing KPIs
const marketingKPIs = [
  { title: 'Customer Acquisition', value: '2,847', change: '+32.8%', trend: 'up', icon: Users },
  { title: 'Campaign ROI', value: '385%', change: '+67%', trend: 'up', icon: DollarSign },
  { title: 'Conversion Rate', value: '4.2%', change: '+28%', trend: 'up', icon: Target },
  { title: 'Processing Time', value: '0.9s', change: '-94%', trend: 'up', icon: Clock },
];

// Campaign performance data
const campaignData = [
  { month: 'Jan', digital: 180000, traditional: 95000, social: 125000, roi: 285 },
  { month: 'Feb', digital: 220000, traditional: 88000, social: 145000, roi: 312 },
  { month: 'Mar', digital: 280000, traditional: 82000, social: 168000, roi: 348 },
  { month: 'Apr', digital: 340000, traditional: 79000, social: 195000, roi: 375 },
  { month: 'May', digital: 420000, traditional: 76000, social: 225000, roi: 398 },
  { month: 'Jun', digital: 480000, traditional: 74000, social: 260000, roi: 425 },
];

// Customer acquisition channels
const acquisitionData = [
  { channel: 'Google Ads', cost: 45000, acquisitions: 1250, cpa: 36, quality: 92 },
  { channel: 'Facebook', cost: 38000, acquisitions: 1180, cpa: 32, quality: 88 },
  { channel: 'LinkedIn', cost: 22000, acquisitions: 420, cpa: 52, quality: 96 },
  { channel: 'TikTok', cost: 18000, acquisitions: 680, cpa: 26, quality: 85 },
  { channel: 'Email', cost: 8000, acquisitions: 580, cpa: 14, quality: 94 },
];

// System improvements
const marketingImprovements = [
  { metric: 'Campaign ROI Calculation', oldTime: '15+ min', newTime: '0.9 sec', improvement: '99.9%', status: 'Fixed' },
  { metric: 'Multi-Channel Attribution', oldTime: 'Failed', newTime: '1.1 sec', improvement: '100%', status: 'Fixed' },
  { metric: 'Customer Journey Analysis', oldTime: 'Incomplete', newTime: 'Real-time', improvement: '100%', status: 'Fixed' },
  { metric: 'A/B Testing Reports', oldTime: 'Timeout', newTime: '0.8 sec', improvement: '100%', status: 'Fixed' },
];

export default function MarketingDashboard() {
  return (
    <div className="space-y-6">
      {/* Marketing KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketingKPIs.map((kpi, index) => {
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

      {/* Campaign Performance & ROI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance & ROI Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis yAxisId="left" stroke="#666" />
              <YAxis yAxisId="right" orientation="right" stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: number, name: string) => {
                  if (name === 'roi') return [`${value}%`, 'ROI'];
                  return [`$${value.toLocaleString()}`, name];
                }}
              />
              <Bar yAxisId="left" dataKey="digital" fill="#3B82F6" name="Digital" />
              <Bar yAxisId="left" dataKey="social" fill="#10B981" name="Social" />
              <Bar yAxisId="left" dataKey="traditional" fill="#F59E0B" name="Traditional" />
              <Line yAxisId="right" type="monotone" dataKey="roi" stroke="#EF4444" strokeWidth={3} name="ROI %" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Performance Breakthroughs</h4>
          <p className="text-sm text-green-700">
            ✅ Campaign ROI calculations now complete in under 1 second (previously 15+ minutes)<br/>
            ✅ Multi-channel attribution analysis processes unlimited data volumes<br/>
            ✅ Real-time campaign optimization with zero system delays
          </p>
        </div>
      </div>

      {/* Customer Acquisition & System Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Acquisition Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Acquisition Channels</h3>
          <div className="space-y-4">
            {acquisitionData.map((channel, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{channel.channel}</h4>
                  <span className="text-sm font-medium text-blue-600">${channel.cpa} CPA</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Acquisitions</p>
                    <p className="font-semibold text-green-600">{channel.acquisitions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Spend</p>
                    <p className="font-semibold">${channel.cost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quality Score</p>
                    <p className="font-semibold text-purple-600">{channel.quality}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing System Improvements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Issues RESOLVED</h3>
          <div className="space-y-4">
            {marketingImprovements.map((improvement, index) => (
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

      {/* Marketing Intelligence */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing Intelligence Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Megaphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Campaign Reach</h4>
            <p className="text-lg font-bold text-blue-600 mt-1">2.8M</p>
            <p className="text-xs text-gray-500">Monthly impressions</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MousePointer className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Engagement Rate</h4>
            <p className="text-lg font-bold text-green-600 mt-1">6.8%</p>
            <p className="text-xs text-gray-500">Cross-platform average</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Brand Awareness</h4>
            <p className="text-lg font-bold text-purple-600 mt-1">89.2%</p>
            <p className="text-xs text-gray-500">Target market recognition</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">Marketing Success Stories</h4>
          <div className="text-sm text-green-700 space-y-1">
            <p>📈 Digital campaign attribution models now process in real-time</p>
            <p>🎯 Customer journey analysis handles unlimited touchpoints</p>
            <p>💰 ROI calculations complete instantly across all channels</p>
            <p>📊 A/B testing results available immediately after campaign launch</p>
          </div>
        </div>
      </div>
    </div>
  );
} 