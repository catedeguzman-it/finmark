'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Plus, 
  Minus, 
  Building2, 
  Users, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';
import { Organization, UserProfile } from '@/app/dashboard/types';

interface AdminPanelProps {
  isOpen: boolean;
  organizations: Organization[];
  userProfile: UserProfile;
  onAssignOrganization: (orgId: string) => void;
  onUnassignOrganization: (orgId: string) => void;
}

export function AdminPanel({ 
  isOpen, 
  organizations, 
  userProfile, 
  onAssignOrganization, 
  onUnassignOrganization 
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get user's assigned organizations
  const assignedOrgIds = userProfile.assignedOrganizations || [];
  
  // Filter organizations based on search and type
  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           org.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || org.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [organizations, searchTerm, selectedType]);

  // Separate assigned and unassigned organizations
  const assignedOrgs = filteredOrganizations.filter(org => assignedOrgIds.includes(org.id));
  const unassignedOrgs = filteredOrganizations.filter(org => !assignedOrgIds.includes(org.id));

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'bg-green-100 text-green-800',
      'trial': 'bg-yellow-100 text-yellow-800',
      'inactive': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const variants = {
      'enterprise': 'bg-purple-100 text-purple-800',
      'professional': 'bg-blue-100 text-blue-800',
      'basic': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[plan as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {plan}
      </Badge>
    );
  };

  const organizationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'financial', label: 'Financial' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'government', label: 'Government' }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Close panel when clicking backdrop
          window.dispatchEvent(new CustomEvent('closeAdminPanel'));
        }
      }}
    >
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <CardTitle className="text-xl">Admin Panel</CardTitle>
                <CardDescription>Manage organization assignments and access</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{assignedOrgIds.length} assigned</span>
              <span>•</span>
              <Building2 className="h-4 w-4" />
              <span>{organizations.length} total</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="p-6 border-b bg-gray-50/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {organizationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-2 m-6 mb-0">
              <TabsTrigger value="assigned" className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Assigned ({assignedOrgs.length})</span>
              </TabsTrigger>
              <TabsTrigger value="available" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Available ({unassignedOrgs.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="m-6 mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {assignedOrgs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <XCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No assigned organizations found</p>
                    </div>
                  ) : (
                    assignedOrgs.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50 border-green-200">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{org.name}</h4>
                            {getStatusBadge(org.status)}
                            {getPlanBadge(org.plan)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{org.industry} • {org.location}</p>
                            <p className="flex items-center space-x-4">
                              <span>{org.employees.toLocaleString()} employees</span>
                              <span>Revenue: {org.revenue}</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Last accessed: {new Date(org.lastAccessed).toLocaleDateString()}</span>
                              </span>
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnassignOrganization(org.id)}
                          className="ml-4 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="available" className="m-6 mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {unassignedOrgs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>All organizations are assigned</p>
                    </div>
                  ) : (
                    unassignedOrgs.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{org.name}</h4>
                            {getStatusBadge(org.status)}
                            {getPlanBadge(org.plan)}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{org.industry} • {org.location}</p>
                            <p className="flex items-center space-x-4">
                              <span>{org.employees.toLocaleString()} employees</span>
                              <span>Revenue: {org.revenue}</span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Last accessed: {new Date(org.lastAccessed).toLocaleDateString()}</span>
                              </span>
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAssignOrganization(org.id)}
                          className="ml-4 text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}