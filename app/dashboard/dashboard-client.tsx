'use client';

import { useState, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Import types and data
import { Organization, Dashboard, UserProfile } from './types';
import { organizations, dashboards, getUserProfile } from './data';

// Import components
import { DashboardHeader, OrganizationView, DashboardView } from './components';

// Import existing dashboard components
import ExecutiveOverviewDashboard from '../../components/dashboards/ExecutiveOverviewDashboard';
import FinancialAnalyticsDashboard from '../../components/dashboards/FinancialAnalyticsDashboard';
import HealthcareDashboard from '../../components/dashboards/HealthcareDashboard';
import ManufacturingDashboard from '../../components/dashboards/ManufacturingDashboard';
import MarketingDashboard from '../../components/dashboards/MarketingDashboard';
import EcommerceDashboard from '../../components/dashboards/EcommerceDashboard';

interface DashboardClientProps {
  user: User;
}

type ViewState = 
  | { type: 'organizations' }
  | { type: 'dashboards'; organization: Organization }
  | { type: 'dashboard'; organization: Organization; dashboard: Dashboard };

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  
  // Get user profile
  const userProfile: UserProfile = useMemo(() => {
    console.log('User object:', user);
    console.log('User email:', user.email);
    const profile = getUserProfile(user.email);
    console.log('Resolved profile:', profile);
    return profile;
  }, [user.email]);

  // View state management
  const [viewState, setViewState] = useState<ViewState>({ type: 'organizations' });

  // Navigation handlers
  const handleSelectOrganization = (organization: Organization) => {
    setViewState({ type: 'dashboards', organization });
  };

  const handleAccessDashboard = (dashboard: Dashboard) => {
    if (viewState.type === 'dashboards') {
      setViewState({ 
        type: 'dashboard', 
        organization: viewState.organization, 
        dashboard 
      });
    }
  };

  const handleBackToOrganizations = () => {
    setViewState({ type: 'organizations' });
  };

  const handleBackToDashboards = () => {
    if (viewState.type === 'dashboard') {
      setViewState({ 
        type: 'dashboards', 
        organization: viewState.organization 
      });
    }
  };

  // Render individual dashboard component
  const renderDashboard = (dashboard: Dashboard, organization: Organization) => {
    // Add a back button wrapper for all dashboards
    const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToDashboards}
            className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to {organization.name} Dashboards</span>
          </button>
          <div className="text-sm text-gray-500">
            {organization.name} • {dashboard.title}
          </div>
        </div>
        {children}
      </div>
    );

    switch (dashboard.id) {
      case 'overview':
        return <DashboardWrapper><ExecutiveOverviewDashboard /></DashboardWrapper>;
      case 'financial':
        return <DashboardWrapper><FinancialAnalyticsDashboard /></DashboardWrapper>;
      case 'healthcare':
        return <DashboardWrapper><HealthcareDashboard /></DashboardWrapper>;
      case 'manufacturing':
        return <DashboardWrapper><ManufacturingDashboard /></DashboardWrapper>;
      case 'marketing':
        return <DashboardWrapper><MarketingDashboard /></DashboardWrapper>;
      case 'ecommerce':
        return <DashboardWrapper><EcommerceDashboard /></DashboardWrapper>;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Not Found</h3>
            <p className="text-gray-500 mb-4">The requested dashboard could not be loaded.</p>
            <button
              onClick={handleBackToDashboards}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Dashboards
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <DashboardHeader userProfile={userProfile} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {viewState.type === 'organizations' && (
          <OrganizationView
            organizations={organizations}
            userProfile={userProfile}
            onSelectOrganization={handleSelectOrganization}
          />
        )}
        
        {viewState.type === 'dashboards' && (
          <DashboardView
            organization={viewState.organization}
            dashboards={dashboards}
            userProfile={userProfile}
            onAccessDashboard={handleAccessDashboard}
            onBack={handleBackToOrganizations}
          />
        )}
        
        {viewState.type === 'dashboard' && (
          <div className="space-y-6">
            {renderDashboard(viewState.dashboard, viewState.organization)}
          </div>
        )}
      </main>
    </div>
  );
} 