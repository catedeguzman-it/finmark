'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    color: string;
  }[];
  isActive?: boolean;
  onClick: () => void;
}

export default function DashboardCard({
  title,
  description,
  icon: Icon,
  metrics,
  isActive = false,
  onClick
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-6 bg-white rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl",
        isActive 
          ? "border-blue-500 shadow-lg ring-2 ring-blue-100" 
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-xl transition-colors",
            isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-500"
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="flex items-center space-x-1 text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Active</span>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
            <div className="flex items-center space-x-2">
              <span className={cn("text-lg font-bold", metric.color)}>
                {metric.value}
              </span>
              <div className={cn(
                "flex items-center px-2 py-1 rounded-full text-xs font-medium",
                metric.trend === 'up' ? "bg-green-100 text-green-700" :
                metric.trend === 'down' ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              )}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Click indicator */}
      <div className={cn(
        "absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity",
        isActive && "opacity-100"
      )}>
        <div className="flex items-center space-x-1 text-blue-500">
          <span className="text-xs font-medium">View Dashboard</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 