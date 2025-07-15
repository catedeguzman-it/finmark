import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Factory, 
  Heart,
  Building2,
  LucideIcon
} from 'lucide-react';

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  'BarChart3': BarChart3,
  'TrendingUp': TrendingUp,
  'Users': Users,
  'ShoppingCart': ShoppingCart,
  'Factory': Factory,
  'Heart': Heart,
  'Building2': Building2
};

// Helper function to get icon component from string name
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || BarChart3;
}

// Helper function to convert dashboard with string icon to dashboard with icon component
export function convertDashboardIcon(dashboard: any) {
  return {
    ...dashboard,
    icon: getIconComponent(dashboard.icon)
  };
}