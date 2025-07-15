'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { createClient } from '../../utils/supabase/client';
import { getIconComponent } from '@/utils/iconUtils';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  activeDashboard: string;
  onDashboardChange: (dashboard: string) => void;
}

const dashboardTypes = [
  { id: 'overview', name: 'Executive Overview', icon: 'BarChart3', description: 'High-level KPIs and metrics' },
  { id: 'financial', name: 'Financial Analytics', icon: 'TrendingUp', description: 'Revenue, expenses, and financial health' },
  { id: 'marketing', name: 'Marketing Analytics', icon: 'Users', description: 'Customer acquisition and campaigns' },
  { id: 'ecommerce', name: 'E-commerce', icon: 'ShoppingCart', description: 'Sales, inventory, and customer behavior' },
  { id: 'manufacturing', name: 'Manufacturing', icon: 'Building2', description: 'Production, supply chain, and efficiency' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', description: 'Patient flow, outcomes, and operations' },
];

export default function DashboardLayout({ user, children, activeDashboard, onDashboardChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const activeDashboardInfo = dashboardTypes.find(d => d.id === activeDashboard);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">FinMark Analytics</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {dashboardTypes.map((dashboard) => {
              const Icon = getIconComponent(dashboard.icon);
              const isActive = activeDashboard === dashboard.id;
              
              return (
                <button
                  key={dashboard.id}
                  onClick={() => {
                    onDashboardChange(dashboard.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <div className="text-left">
                    <div>{dashboard.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{dashboard.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeDashboardInfo?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {activeDashboardInfo?.description || 'Analytics dashboard'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
} 