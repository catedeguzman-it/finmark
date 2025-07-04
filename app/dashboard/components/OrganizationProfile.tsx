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
      
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
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
          <p className="text-gray-600 mt-4 leading-relaxed text-lg">
            {organization.description}
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Organization Details</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Employees</p>
                    <p className="font-medium text-gray-900">{organization.employees.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Annual Revenue</p>
                    <p className="font-medium text-gray-900">{organization.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{organization.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium text-gray-900">{organization.established}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium text-gray-900">{organization.website}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{organization.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{organization.industry}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-blue-600">Available Dashboards</p>
                    <p className="font-medium text-blue-900">
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