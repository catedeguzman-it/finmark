'use client';

import { useState, useMemo } from 'react';
import { FilterBar } from './FilterBar';
import { DashboardCard } from './DashboardCard';
import { OrganizationProfile } from './OrganizationProfile';
import { Organization, Dashboard, UserProfile, FilterState } from '../types';

interface DashboardViewProps {
  organization: Organization;
  dashboards: Dashboard[];
  userProfile: UserProfile;
  onAccessDashboard: (dashboard: Dashboard) => void;
  onBack: () => void;
}

export function DashboardView({ 
  organization, 
  dashboards, 
  userProfile, 
  onAccessDashboard, 
  onBack 
}: DashboardViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    type: 'all',
    search: ''
  });

  const availableDashboards = useMemo(() => {
    return dashboards.filter(dashboard => 
      organization.availableDashboards.includes(dashboard.id)
    );
  }, [dashboards, organization]);

  const filteredDashboards = useMemo(() => {
    return availableDashboards.filter(dashboard => {
      // Filter by category
      if (filters.category !== 'all' && dashboard.category !== filters.category) return false;

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          dashboard.title.toLowerCase().includes(searchLower) ||
          dashboard.description.toLowerCase().includes(searchLower) ||
          dashboard.category.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [availableDashboards, filters]);

  const assignedDashboards = useMemo(() => {
    // For now, we'll consider all available dashboards as assigned
    // In a real app, this would come from user permissions/assignments
    return organization.availableDashboards;
  }, [organization]);

  return (
    <div className="space-y-8">
      <OrganizationProfile organization={organization} onBack={onBack} />
      
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboards</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Access comprehensive analytics and business intelligence tools for {organization.name}.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>{availableDashboards.length} dashboards available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span>Showing {filteredDashboards.length} results</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <FilterBar 
            filters={filters}
            onFiltersChange={setFilters}
            view="dashboards"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard.id}
              dashboard={dashboard}
              userProfile={userProfile}
              onAccess={onAccessDashboard}
              isAssigned={assignedDashboards.includes(dashboard.id)}
            />
          ))}
        </div>

        {filteredDashboards.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dashboards found</h3>
            <p className="text-gray-500">
              {filters.search || filters.category !== 'all'
                ? 'Try adjusting your search filters.'
                : 'No dashboards are available for this organization.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 