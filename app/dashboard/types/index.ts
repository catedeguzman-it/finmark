import { User } from '@supabase/supabase-js';
import { LucideIcon } from 'lucide-react';

export interface DashboardClientProps {
  user: User;
}

export interface Organization {
  id: string;
  name: string;
  type: 'financial' | 'healthcare' | 'manufacturing' | 'ecommerce' | 'education' | 'government';
  description: string;
  logo?: string;
  established: string;
  location: string;
  employees: number;
  revenue: string;
  industry: string;
  website: string;
  phone: string;
  availableDashboards: string[];
  status: 'active' | 'inactive' | 'trial';
  plan: 'basic' | 'professional' | 'enterprise';
  lastAccessed: string;
}

export interface UserProfile {
  name: string;
  position: string;
  department: string;
  location: string;
  role: 'analyst' | 'stakeholder' | 'executive';
  assignedOrganizations: string[];
  permissions: string[];
  lastActive: string;
  avatar?: string | null;
}

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metrics: DashboardMetric[];
  status: string;
  category: string;
  color: string;
  bgColor: string;
  iconColor: string;
  requiredRole: string[];
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

export interface FilterState {
  category: string;
  type: string;
  search: string;
} 