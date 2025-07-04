import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Factory, 
  Heart
} from 'lucide-react';
import { Dashboard } from '../types';

export const dashboards: Dashboard[] = [
  {
    id: 'overview',
    title: 'Executive Overview',
    description: 'High-level KPIs, system health, and performance metrics across all business units',
    icon: BarChart3,
    metrics: [
      { label: 'System Uptime', value: '99.8%', trend: 'up' },
      { label: 'Processing Speed', value: '0.8s', trend: 'up' },
      { label: 'Active Users', value: '2,847', trend: 'up' }
    ],
    status: 'operational',
    category: 'Executive',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    requiredRole: ['analyst', 'stakeholder', 'executive']
  },
  {
    id: 'financial',
    title: 'Financial Analytics',
    description: 'Multi-currency analysis, cash flow monitoring, and portfolio performance tracking',
    icon: TrendingUp,
    metrics: [
      { label: 'Total Revenue', value: '$2.4M', trend: 'up' },
      { label: 'Profit Margin', value: '23.5%', trend: 'up' },
      { label: 'Active Portfolios', value: '156', trend: 'stable' }
    ],
    status: 'operational',
    category: 'Finance',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    requiredRole: ['analyst', 'stakeholder']
  },
  {
    id: 'marketing',
    title: 'Marketing Analytics',
    description: 'Campaign performance, customer acquisition, and ROI tracking across channels',
    icon: Users,
    metrics: [
      { label: 'Campaign ROI', value: '340%', trend: 'up' },
      { label: 'Lead Generation', value: '1,892', trend: 'up' },
      { label: 'Conversion Rate', value: '8.2%', trend: 'up' }
    ],
    status: 'operational',
    category: 'Marketing',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    requiredRole: ['analyst', 'stakeholder']
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Analytics',
    description: 'Multi-platform sales tracking, inventory management, and customer behavior analysis',
    icon: ShoppingCart,
    metrics: [
      { label: 'Total Sales', value: '$847K', trend: 'up' },
      { label: 'Order Volume', value: '3,421', trend: 'up' },
      { label: 'Customer Satisfaction', value: '94.2%', trend: 'stable' }
    ],
    status: 'operational',
    category: 'E-commerce',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    requiredRole: ['analyst', 'stakeholder']
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Analytics',
    description: 'Production efficiency, supply chain optimization, and quality control metrics',
    icon: Factory,
    metrics: [
      { label: 'Production Efficiency', value: '92.7%', trend: 'up' },
      { label: 'Quality Score', value: '98.1%', trend: 'stable' },
      { label: 'On-time Delivery', value: '96.4%', trend: 'up' }
    ],
    status: 'operational',
    category: 'Manufacturing',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    requiredRole: ['analyst']
  },
  {
    id: 'healthcare',
    title: 'Healthcare Analytics',
    description: 'Patient flow monitoring, resource utilization, and outcome tracking for healthcare facilities',
    icon: Heart,
    metrics: [
      { label: 'Patient Satisfaction', value: '97.3%', trend: 'up' },
      { label: 'Bed Utilization', value: '84.2%', trend: 'stable' },
      { label: 'Average Wait Time', value: '12 min', trend: 'down' }
    ],
    status: 'operational',
    category: 'Healthcare',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    requiredRole: ['analyst']
  }
]; 