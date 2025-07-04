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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'healthcare':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'manufacturing':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'ecommerce':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'education':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'government':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: Organization['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanBadgeColor = (plan: Organization['plan']) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'professional':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'basic':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group cursor-pointer border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
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
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {organization.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{organization.employees.toLocaleString()} employees</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{organization.revenue} revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{organization.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Est. {organization.established}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">
                  {organization.availableDashboards.length} dashboard{organization.availableDashboards.length !== 1 ? 's' : ''} available
                </span>
              </div>
              <Button 
                size="sm" 
                onClick={() => onSelect(organization)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
              >
                Access
              </Button>
            </div>
          </div>
          
          <div className="pt-2 space-y-1">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Globe className="h-3 w-3" />
              <span>{organization.website}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Phone className="h-3 w-3" />
              <span>{organization.phone}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 