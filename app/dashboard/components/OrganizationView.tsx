'use client';

import { useState, useMemo } from 'react';
import { FilterBar } from './FilterBar';
import { OrganizationCard } from './OrganizationCard';
import { Organization, UserProfile, FilterState } from '../types';

interface OrganizationViewProps {
  organizations: Organization[];
  userProfile: UserProfile;
  onSelectOrganization: (organization: Organization) => void;
}

export function OrganizationView({ organizations, userProfile, onSelectOrganization }: OrganizationViewProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    type: 'all',
    search: ''
  });

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      // Organizations are already filtered by assignment at page level
      
      // Filter by type
      if (filters.type !== 'all' && org.type !== filters.type) return false;

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          org.name.toLowerCase().includes(searchLower) ||
          org.description.toLowerCase().includes(searchLower) ||
          org.industry.toLowerCase().includes(searchLower) ||
          org.location.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [organizations, filters]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Select Organization</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose an organization to access their analytics dashboards and business intelligence tools.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="size-2 rounded-full bg-green-500"></div>
            <span>You have access to {userProfile.assignedOrganizations.length} organizations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="size-2 rounded-full bg-primary"></div>
            <span>Showing {filteredOrganizations.length} results</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <FilterBar 
          filters={filters}
          onFiltersChange={setFilters}
          view="organizations"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {filteredOrganizations.map((org) => (
          <OrganizationCard
            key={org.id}
            organization={org}
            onSelect={onSelectOrganization}
          />
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <div className="size-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No organizations found</h3>
          <p className="text-muted-foreground">
            {filters.search || filters.type !== 'all'
              ? 'Try adjusting your search filters.'
              : 'You don\'t have access to any organizations yet.'}
          </p>
        </div>
      )}
    </div>
  );
} 