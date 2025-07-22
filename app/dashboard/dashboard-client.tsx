'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useTheme } from 'next-themes';
import { useAdminMode } from '@/hooks/use-admin-mode';
import { AdminFloatingButton } from '@/components/ui/admin-floating-button';
import { AdminPanel } from '@/components/ui/admin-panel';
import { showDummyAction } from '@/utils/exportUtils';
import { UserPermissionsProvider } from '@/hooks/use-user-permissions';
import { RoleBasedDashboard } from '@/components/RoleBasedDashboard';
import { AppNavbar } from '@/components/ui/app-navbar';
import { DashboardBreadcrumb } from '@/components/ui/dashboard-breadcrumb';
import { DashboardStats } from '@/components/ui/dashboard-stats';
import { SelectUser } from '@/db/schema';

// Import types
import { Organization, Dashboard, UserProfile } from './types';

// Import components
import { OrganizationView, DashboardView } from './components';

// Import existing dashboard components
import ExecutiveOverviewDashboard from '../../components/dashboards/ExecutiveOverviewDashboard';
import ImprovedFinancialDashboard from '../../components/dashboards/ImprovedFinancialDashboard';
import HealthcareDashboard from '../../components/dashboards/HealthcareDashboard';
import ManufacturingDashboard from '../../components/dashboards/ManufacturingDashboard';
import MarketingDashboard from '../../components/dashboards/MarketingDashboard';
import ImprovedEcommerceDashboard from '../../components/dashboards/ImprovedEcommerceDashboard';

interface DashboardClientProps {
  user: User;
  dbUser: SelectUser;
  organizations: Organization[];
  dashboards: Dashboard[];
  userProfile: UserProfile;
}

type ViewState = 
  | { type: 'organizations' }
  | { type: 'dashboards'; organization: Organization }
  | { type: 'dashboard'; organization: Organization; dashboard: Dashboard };

export default function DashboardClient({ dbUser, organizations, dashboards, userProfile: initialUserProfile }: DashboardClientProps) {
  const { isAdminMode } = useAdminMode();
  const { setTheme } = useTheme();
  
  // Force light mode for dashboard
  useEffect(() => {
    setTheme('light');
  }, [setTheme]);
  
  // Use the provided user profile
  const userProfile: UserProfile = initialUserProfile;

  // View state management
  const [viewState, setViewState] = useState<ViewState>({ type: 'organizations' });
  
  // Admin state management
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [userAssignedOrgs, setUserAssignedOrgs] = useState<string[]>(
    userProfile.assignedOrganizations || []
  );

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

  // Admin functionality handlers
  const handleToggleAdminPanel = () => {
    setIsAdminPanelOpen(!isAdminPanelOpen);
  };

  const handleAssignOrganization = (orgId: string) => {
    if (!userAssignedOrgs.includes(orgId)) {
      setUserAssignedOrgs([...userAssignedOrgs, orgId]);
      showDummyAction(`Organization assigned successfully`);
    }
  };

  const handleUnassignOrganization = (orgId: string) => {
    setUserAssignedOrgs(userAssignedOrgs.filter(id => id !== orgId));
    showDummyAction(`Organization unassigned successfully`);
  };

  // Update user profile with current assignments
  const updatedUserProfile: UserProfile = {
    ...userProfile,
    assignedOrganizations: userAssignedOrgs
  };

  // Listen for close admin panel events
  useEffect(() => {
    const handleCloseAdminPanel = () => {
      setIsAdminPanelOpen(false);
    };

    window.addEventListener('closeAdminPanel', handleCloseAdminPanel);
    return () => {
      window.removeEventListener('closeAdminPanel', handleCloseAdminPanel);
    };
  }, []);

  // Render individual dashboard component
  const renderDashboard = (dashboard: Dashboard, organization: Organization) => {
    // Enhanced dashboard wrapper with better styling and metrics
    const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="space-y-6">
        {/* Dashboard Header with Metrics */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboards}
                className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Dashboards</span>
              </button>
              <div className="text-sm text-gray-500">
                {organization.name} • {organization.type}
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">{dashboard.title}</h1>
              <p className="text-sm text-gray-600">{dashboard.description}</p>
            </div>
          </div>
          
          {/* Quick Metrics Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboard.metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {children}
        </div>
      </div>
    );

    switch (dashboard.id) {
      case 'overview':
        return <DashboardWrapper><ExecutiveOverviewDashboard /></DashboardWrapper>;
      case 'financial':
        return <DashboardWrapper><ImprovedFinancialDashboard /></DashboardWrapper>;
      case 'healthcare':
        return <DashboardWrapper><HealthcareDashboard /></DashboardWrapper>;
      case 'manufacturing':
        return <DashboardWrapper><ManufacturingDashboard /></DashboardWrapper>;
      case 'marketing':
        return <DashboardWrapper><MarketingDashboard /></DashboardWrapper>;
      case 'ecommerce':
        return <DashboardWrapper><ImprovedEcommerceDashboard /></DashboardWrapper>;
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
    <UserPermissionsProvider>
      <div className="light min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <AppNavbar user={dbUser} />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <RoleBasedDashboard>
            {/* Enhanced Breadcrumb Navigation */}
            <DashboardBreadcrumb
              organization={viewState.type !== 'organizations' ? 
                (viewState.type === 'dashboards' ? viewState.organization : viewState.organization) : undefined}
              dashboard={viewState.type === 'dashboard' ? viewState.dashboard : undefined}
              onNavigateHome={handleBackToOrganizations}
              onNavigateToOrganization={viewState.type === 'dashboard' ? handleBackToDashboards : undefined}
            />

            {viewState.type === 'organizations' && (
              <OrganizationView
                organizations={organizations}
                userProfile={updatedUserProfile}
                onSelectOrganization={handleSelectOrganization}
              />
            )}
            
            {viewState.type === 'dashboards' && (
              <div className="space-y-6">
                {/* Dashboard Stats */}
                <DashboardStats
                  organizationName={viewState.organization.name}
                  dashboardCount={viewState.organization.availableDashboards.length}
                  totalMetrics={dashboards
                    .filter(d => viewState.organization.availableDashboards.includes(d.id))
                    .reduce((total, d) => total + d.metrics.length, 0)
                  }
                />
                
                <DashboardView
                  organization={viewState.organization}
                  dashboards={dashboards}
                  userProfile={updatedUserProfile}
                  onAccessDashboard={handleAccessDashboard}
                  onBack={handleBackToOrganizations}
                />
              </div>
            )}
            
            {viewState.type === 'dashboard' && (
              <div className="space-y-6">
                {renderDashboard(viewState.dashboard, viewState.organization)}
              </div>
            )}
          </RoleBasedDashboard>
        </main>

        {/* Admin Mode Components */}
        {isAdminMode && (
          <>
            <AdminFloatingButton 
              onClick={handleToggleAdminPanel}
              isOpen={isAdminPanelOpen}
            />
            <AdminPanel
              isOpen={isAdminPanelOpen}
              organizations={organizations}
              userProfile={updatedUserProfile}
              onAssignOrganization={handleAssignOrganization}
              onUnassignOrganization={handleUnassignOrganization}
            />
          </>
        )}
      </div>
    </UserPermissionsProvider>
  );
} 