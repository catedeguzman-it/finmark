'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Dashboard, UserProfile } from '../types';

interface DashboardCardProps {
  dashboard: Dashboard;
  userProfile: UserProfile;
  onAccess: (dashboard: Dashboard) => void;
  isAssigned?: boolean;
}

export function DashboardCard({ dashboard, userProfile, onAccess, isAssigned }: DashboardCardProps) {
  const Icon = dashboard.icon;
  const hasAccess = dashboard.requiredRole.includes(userProfile.role);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-yellow-500" />;
    }
  };

  return (
    <Card 
      className={`h-full transition-all duration-200 hover:scale-[1.02] group cursor-pointer border-0 shadow-md
        ${hasAccess ? 'hover:shadow-lg' : 'opacity-75 grayscale'}
        ${isAssigned ? 'ring-2 ring-blue-200 ring-opacity-60' : ''}
      `}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${dashboard.color} shadow-sm`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {dashboard.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                  {dashboard.category}
                </Badge>
                {isAssigned && (
                  <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                    Assigned
                  </Badge>
                )}
                {!hasAccess && (
                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    Restricted
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {dashboard.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid gap-3">
            {dashboard.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-green-400`}></div>
                <span className="text-sm text-gray-600 capitalize">{dashboard.status}</span>
              </div>
              <Button 
                size="sm" 
                onClick={() => onAccess(dashboard)}
                disabled={!hasAccess}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {hasAccess ? 'Access' : 'Restricted'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 