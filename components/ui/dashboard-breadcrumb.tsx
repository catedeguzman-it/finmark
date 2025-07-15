'use client';

import { ChevronRight, Home, Building2, BarChart3 } from 'lucide-react';
import { Organization, Dashboard } from '@/app/dashboard/types';

interface DashboardBreadcrumbProps {
  organization?: Organization;
  dashboard?: Dashboard;
  onNavigateHome: () => void;
  onNavigateToOrganization?: () => void;
}

export function DashboardBreadcrumb({ 
  organization, 
  dashboard, 
  onNavigateHome, 
  onNavigateToOrganization 
}: DashboardBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={onNavigateHome}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Organizations</span>
      </button>
      
      {organization && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {dashboard ? (
            <button
              onClick={onNavigateToOrganization}
              className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
            >
              <Building2 className="h-4 w-4" />
              <span>{organization.name}</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-gray-900 font-medium">
              <Building2 className="h-4 w-4" />
              <span>{organization.name}</span>
            </div>
          )}
        </>
      )}
      
      {dashboard && (
        <>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center space-x-1 text-gray-900 font-medium">
            <BarChart3 className="h-4 w-4" />
            <span>{dashboard.title}</span>
          </div>
        </>
      )}
    </nav>
  );
}