'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Globe, 
  Phone,
  BarChart3
} from 'lucide-react';
import { Organization } from '../types';

interface OrganizationCardProps {
  organization: Organization;
  onSelect: (organization: Organization) => void;
}

export function OrganizationCard({ organization, onSelect }: OrganizationCardProps) {
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
    <Card 
      className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group cursor-pointer"
      onClick={() => onSelect(organization)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Building2 className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {organization.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getTypeBadgeColor(organization.type)}`}
                >
                  {organization.type.charAt(0).toUpperCase() + organization.type.slice(1)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusBadgeColor(organization.status)}`}
                >
                  {organization.status.charAt(0).toUpperCase() + organization.status.slice(1)}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getPlanBadgeColor(organization.plan)}`}
                >
                  {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {organization.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{organization.employees.toLocaleString()} employees</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{organization.revenue} revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{organization.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Est. {organization.established}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="size-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {organization.availableDashboards.length} dashboard{organization.availableDashboards.length !== 1 ? 's' : ''} available
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-primary font-medium">
                <span>Click to access</span>
                <BarChart3 className="size-3" />
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Globe className="size-3" />
              <span>{organization.website}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Phone className="size-3" />
              <span>{organization.phone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 