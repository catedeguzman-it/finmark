'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ExternalLink, Users, Building2, Settings, Eye } from 'lucide-react';

export default function AdminDemo() {
  const handleOpenAdminMode = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('admin', 'true');
    window.open(currentUrl.toString(), '_blank');
  };

  const features = [
    {
      icon: Shield,
      title: 'Admin Mode Activation',
      description: 'Add ?admin=true to the dashboard URL to enable admin mode',
      example: '/dashboard?admin=true'
    },
    {
      icon: Settings,
      title: 'Floating Admin Button',
      description: 'Beautiful floating button appears in bottom-right corner when admin mode is active',
      features: ['Gradient design', 'Hover animations', 'Tooltip on hover']
    },
    {
      icon: Users,
      title: 'Organization Management',
      description: 'Assign and unassign organizations to your account with real-time updates',
      features: ['Search organizations', 'Filter by type', 'Instant assignment']
    },
    {
      icon: Building2,
      title: 'Organization Browser',
      description: 'Browse all available organizations with detailed information',
      features: ['6 different organization types', 'Status and plan badges', 'Employee and revenue data']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Mode Demo</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the powerful admin functionality that allows you to manage organization assignments 
          and browse all available organizations in the system.
        </p>
        
        <div className="flex items-center justify-center space-x-4 mt-6">
          <Button onClick={handleOpenAdminMode} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Dashboard with Admin Mode
          </Button>
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            ?admin=true
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {feature.example && (
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm mb-3">
                    {feature.example}
                  </div>
                )}
                {feature.features && (
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span>How to Use Admin Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">1</div>
              <h4 className="font-semibold">Access Dashboard</h4>
              <p className="text-sm text-gray-600">Navigate to /dashboard and add ?admin=true to the URL</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">2</div>
              <h4 className="font-semibold">Click Admin Button</h4>
              <p className="text-sm text-gray-600">Look for the floating shield button in the bottom-right corner</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">3</div>
              <h4 className="font-semibold">Manage Organizations</h4>
              <p className="text-sm text-gray-600">Assign/unassign organizations and browse all available options</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-xs font-bold text-yellow-800">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-1">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              This is a demonstration environment. All organization assignments are temporary and will reset when you refresh the page. 
              In a production environment, these changes would be persisted to the database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}