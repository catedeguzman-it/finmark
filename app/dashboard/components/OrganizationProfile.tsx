'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Globe, 
  Phone,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { Organization } from '../types';

interface OrganizationProfileProps {
  organization: Organization;
  onBack: () => void;
}

export function OrganizationProfile({ organization, onBack }: OrganizationProfileProps) {
  const getTypeBadgeColor = (type: Organization['type']) => {
    switch (type) {
      case 'financial':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800';
      case 'healthcare':
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800';
      case 'manufacturing':
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800';
      case 'ecommerce':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800';
      case 'education':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'government':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusBadgeColor = (status: Organization['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'trial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPlanBadgeColor = (plan: Organization['plan']) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'basic':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Organizations</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Building2 className="size-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {organization.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    variant="outline" 
                    className={`${getTypeBadgeColor(organization.type)}`}
                  >
                    {organization.type.charAt(0).toUpperCase() + organization.type.slice(1)}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusBadgeColor(organization.status)}`}
                  >
                    {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${getPlanBadgeColor(organization.plan)}`}
                  >
                    {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)} Plan
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
            {organization.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <BarChart3 className="size-5 text-primary" />
                <span>Organization Details</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Users className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employees</p>
                    <p className="font-medium text-foreground">{organization.employees.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <DollarSign className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Revenue</p>
                    <p className="font-medium text-foreground">{organization.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <MapPin className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{organization.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Calendar className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="font-medium text-foreground">{organization.established}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Globe className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <p className="font-medium text-foreground">{organization.website}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Phone className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{organization.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Building2 className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium text-foreground">{organization.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <BarChart3 className="size-5 text-primary" />
                  <div>
                    <p className="text-sm text-primary">Available Dashboards</p>
                    <p className="font-medium text-primary">
                      {organization.availableDashboards.length} dashboard{organization.availableDashboards.length !== 1 ? 's' : ''} accessible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 