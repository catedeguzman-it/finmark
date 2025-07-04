'use client';

import { 
  Heart, 
  Users, 
  Activity, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Bed,
  Stethoscope,
  Building
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

// Healthcare KPIs
const healthcareKPIs = [
  { title: 'Patient Satisfaction', value: '94.8%', change: '+8.3%', trend: 'up', icon: Heart },
  { title: 'Avg Wait Time', value: '8 min', change: '-67%', trend: 'up', icon: Clock },
  { title: 'Bed Occupancy', value: '87.2%', change: '+5.1%', trend: 'up', icon: Bed },
  { title: 'System Uptime', value: '99.9%', change: '+12.8%', trend: 'up', icon: Activity },
];

// Patient flow data (real-time dashboard performance)
const patientFlowData = [
  { hour: '00:00', admissions: 12, discharges: 8, emergency: 15, capacity: 350 },
  { hour: '04:00', admissions: 8, discharges: 5, emergency: 22, capacity: 350 },
  { hour: '08:00', admissions: 45, discharges: 12, emergency: 38, capacity: 350 },
  { hour: '12:00', admissions: 52, discharges: 28, emergency: 45, capacity: 350 },
  { hour: '16:00', admissions: 38, discharges: 35, emergency: 32, capacity: 350 },
  { hour: '20:00', admissions: 28, discharges: 15, emergency: 28, capacity: 350 },
];

// Department performance across regions
const departmentPerformance = [
  { department: 'Emergency', singapore: 92, malaysia: 88, thailand: 85, philippines: 87, indonesia: 84 },
  { department: 'Surgery', singapore: 95, malaysia: 91, thailand: 88, philippines: 90, indonesia: 87 },
  { department: 'Cardiology', singapore: 98, malaysia: 94, thailand: 92, philippines: 93, indonesia: 90 },
  { department: 'Oncology', singapore: 96, malaysia: 93, thailand: 90, philippines: 91, indonesia: 88 },
  { department: 'Pediatrics', singapore: 94, malaysia: 90, thailand: 87, philippines: 88, indonesia: 85 },
];

// Resource utilization
const resourceUtilization = [
  { name: 'ICU Beds', utilized: 85, available: 15, color: '#EF4444' },
  { name: 'Operating Rooms', utilized: 78, available: 22, color: '#3B82F6' },
  { name: 'Medical Equipment', utilized: 82, available: 18, color: '#10B981' },
  { name: 'Staff Capacity', utilized: 89, available: 11, color: '#F59E0B' },
];

// Patient outcome trends
const outcomeData = [
  { month: 'Jan', recoveryRate: 94.2, readmissionRate: 8.5, mortalityRate: 2.1 },
  { month: 'Feb', recoveryRate: 94.8, readmissionRate: 8.1, mortalityRate: 1.9 },
  { month: 'Mar', recoveryRate: 95.1, readmissionRate: 7.8, mortalityRate: 1.8 },
  { month: 'Apr', recoveryRate: 95.5, readmissionRate: 7.5, mortalityRate: 1.6 },
  { month: 'May', recoveryRate: 95.8, readmissionRate: 7.2, mortalityRate: 1.5 },
  { month: 'Jun', recoveryRate: 96.2, readmissionRate: 6.9, mortalityRate: 1.4 },
];

// Revenue and cost analysis for healthcare networks
const financialData = [
  { month: 'Jan', revenue: 2800000, costs: 2100000, margin: 25.0 },
  { month: 'Feb', revenue: 2950000, costs: 2180000, margin: 26.1 },
  { month: 'Mar', revenue: 3100000, costs: 2250000, margin: 27.4 },
  { month: 'Apr', revenue: 3200000, costs: 2300000, margin: 28.1 },
  { month: 'May', revenue: 3350000, costs: 2380000, margin: 29.0 },
  { month: 'Jun', revenue: 3500000, costs: 2450000, margin: 30.0 },
];

// System performance improvements
const systemImprovements = [
  { metric: 'Patient Data Processing', oldTime: '15 min', newTime: '0.5 sec', improvement: '99.9%', impact: 'Critical' },
  { metric: 'Insurance Claims Processing', oldTime: '45 min', newTime: '2.1 sec', improvement: '99.9%', impact: 'High' },
  { metric: 'Real-time Monitoring', oldTime: '10 min delay', newTime: 'Real-time', improvement: '100%', impact: 'Critical' },
  { metric: 'Report Generation', oldTime: '30 min', newTime: '1.8 sec', improvement: '99.9%', impact: 'High' },
];

// Critical alerts and notifications
const healthcareAlerts = [
  { id: 1, message: 'All patient monitoring systems operational', type: 'success', priority: 'low', time: '1 min ago' },
  { id: 2, message: 'Bed capacity optimization completed', type: 'success', priority: 'medium', time: '10 min ago' },
  { id: 3, message: 'Insurance claim processing accelerated', type: 'success', priority: 'high', time: '25 min ago' },
  { id: 4, message: 'Real-time dashboard performance improved', type: 'success', priority: 'high', time: '1 hour ago' },
];

export default function HealthcareDashboard() {
  return (
    <div className="space-y-6">
      {/* Healthcare KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthcareKPIs.map((kpi, index) => {
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

      {/* Real-time Patient Flow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Real-time Patient Flow</h3>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Activity className="h-4 w-4" />
            <span>Live Data - No More Crashes!</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={patientFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="hour" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="admissions" fill="#3B82F6" name="Admissions" />
              <Bar dataKey="discharges" fill="#10B981" name="Discharges" />
              <Line type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={3} name="Emergency" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Performance Improvements</h4>
          <p className="text-sm text-green-700">
            ✅ Real-time dashboard no longer freezes<br/>
            ✅ Patient flow analytics now process instantly<br/>
            ✅ Hospital chain monitoring operates smoothly across all locations
          </p>
        </div>
      </div>

      {/* Resource Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Utilization */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Utilization</h3>
          <div className="space-y-6">
            {resourceUtilization.map((resource, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{resource.name}</span>
                  <span className="text-sm text-gray-600">{resource.utilized}% utilized</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${resource.utilized}%`,
                      backgroundColor: resource.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Optimization Status</h4>
            <p className="text-sm text-blue-700">
              Resource allocation is operating efficiently. Real-time monitoring enables instant adjustments.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Performance & Patient Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Department Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Department Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} stroke="#666" />
                <YAxis dataKey="department" type="category" stroke="#666" width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Bar dataKey="singapore" fill="#3B82F6" name="Singapore" />
                <Bar dataKey="malaysia" fill="#10B981" name="Malaysia" />
                <Bar dataKey="thailand" fill="#F59E0B" name="Thailand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Outcome Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Outcome Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'recoveryRate') return [`${value}%`, 'Recovery Rate'];
                    if (name === 'readmissionRate') return [`${value}%`, 'Readmission Rate'];
                    if (name === 'mortalityRate') return [`${value}%`, 'Mortality Rate'];
                    return [value, name];
                  }}
                />
                <Line type="monotone" dataKey="recoveryRate" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="readmissionRate" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="mortalityRate" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Financial Performance & System Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Healthcare Financial Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis yAxisId="left" stroke="#666" />
                <YAxis yAxisId="right" orientation="right" stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'margin') return [`${value}%`, 'Margin'];
                    return [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Costs'];
                  }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
                <Bar yAxisId="left" dataKey="costs" fill="#EF4444" name="Costs" />
                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#10B981" strokeWidth={3} name="Margin %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Performance Improvements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance Improvements</h3>
          <div className="space-y-4">
            {systemImprovements.map((improvement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{improvement.metric}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    improvement.impact === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {improvement.impact}
                  </span>
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

      {/* System Status & Critical Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>All Systems Operational</span>
            </div>
          </div>
          <div className="space-y-3">
            {healthcareAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                  alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {alert.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Healthcare Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Healthcare Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Patient Safety</h4>
              <p className="text-lg font-bold text-green-600 mt-1">99.7%</p>
              <p className="text-xs text-gray-500">Incident-free rate</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Care Quality</h4>
              <p className="text-lg font-bold text-blue-600 mt-1">96.8%</p>
              <p className="text-xs text-gray-500">Quality score</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Facility Usage</h4>
              <p className="text-lg font-bold text-purple-600 mt-1">91.2%</p>
              <p className="text-xs text-gray-500">Efficiency rate</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900">Response Time</h4>
              <p className="text-lg font-bold text-yellow-600 mt-1">0.8s</p>
              <p className="text-xs text-gray-500">System response</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 