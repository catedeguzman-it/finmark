'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Dashboard, UserProfile } from '../types';
import { getIconComponent } from '@/utils/iconUtils';

interface DashboardCardProps {
  dashboard: Dashboard;
  userProfile: UserProfile;
  onAccess: (dashboard: Dashboard) => void;
  isAssigned?: boolean;
}

export function DashboardCard({ dashboard, userProfile, onAccess, isAssigned }: DashboardCardProps) {
  const Icon = getIconComponent(dashboard.icon);
  const hasAccess = true; // Remove role restrictions - all users can access all dashboards

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
      className={`h-full transition-all duration-200 group border-0 shadow-md
        ${hasAccess ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer' : 'opacity-75 grayscale cursor-not-allowed'}
        ${isAssigned ? 'ring-2 ring-blue-200 ring-opacity-60' : ''}
      `}
      onClick={() => hasAccess && onAccess(dashboard)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${dashboard.color} shadow-sm`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {dashboard.title}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs bg-muted text-muted-foreground border-border">
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
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {dashboard.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid gap-3">
            {dashboard.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">{metric.value}</span>
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`size-2 rounded-full bg-green-500`}></div>
                <span className="text-sm text-muted-foreground capitalize">{dashboard.status}</span>
              </div>
              {hasAccess ? (
                <div className="flex items-center space-x-2 text-xs text-primary font-medium">
                  <span>Click to access</span>
                  <Icon className="size-3" />
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-xs text-destructive font-medium">
                  <span>Restricted</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 