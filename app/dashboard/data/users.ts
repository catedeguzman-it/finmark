import { UserProfile } from '../types';

export const userProfiles: Record<string, UserProfile> = {
  'luis.valerio@finmark.com': {
    name: 'Luis R. Valerio',
    position: 'Senior Financial Analyst',
    department: 'Analytics',
    location: 'Singapore',
    role: 'analyst',
    assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'],
    permissions: ['view', 'export', 'share'],
    lastActive: new Date().toISOString(),
    avatar: null
  },
  'sarah.chen@finmark.com': {
    name: 'Sarah Chen',
    position: 'Regional Business Intelligence Manager',
    department: 'Business Intelligence',
    location: 'Singapore',
    role: 'stakeholder',
    assignedOrganizations: ['maybank', 'genting-manufacturing', 'thailand-ministry-health', 'ntu-singapore'],
    permissions: ['view', 'export', 'share', 'manage'],
    lastActive: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    avatar: null
  },
  // Common demo emails for easy testing
  'demo@example.com': {
    name: 'Demo User',
    position: 'Senior Analytics Specialist',
    department: 'Business Intelligence',
    location: 'Singapore',
    role: 'analyst',
    assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'],
    permissions: ['view', 'export', 'share'],
    lastActive: new Date().toISOString(),
    avatar: null
  },
  'test@test.com': {
    name: 'Test User',
    position: 'Business Analyst',
    department: 'Analytics',
    location: 'Singapore',
    role: 'analyst',
    assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'],
    permissions: ['view', 'export', 'share'],
    lastActive: new Date().toISOString(),
    avatar: null
  },
  // Add a catch-all for common test emails
  'user@localhost': {
    name: 'Local User',
    position: 'Business Analyst',
    department: 'Analytics',
    location: 'Singapore',
    role: 'analyst',
    assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'],
    permissions: ['view', 'export', 'share'],
    lastActive: new Date().toISOString(),
    avatar: null
  }
};

export const getDefaultUser = (): UserProfile => ({
  name: 'Demo User',
  position: 'Senior Analytics Specialist',
  department: 'Business Intelligence',
  location: 'Singapore',
  role: 'analyst',
  assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'], // Give demo user access to some organizations
  permissions: ['view', 'export', 'share'],
  lastActive: new Date().toISOString(),
  avatar: null
});

// Helper function to get user profile with fallback logic
export const getUserProfile = (email: string | null | undefined): UserProfile => {
  if (!email) {
    return getDefaultUser();
  }
  
  // Check for exact email match first
  if (userProfiles[email]) {
    return userProfiles[email];
  }
  
  // Check for any email with same domain
  const domain = email.split('@')[1];
  if (domain === 'finmark.com') {
    // If it's a finmark email, give them analyst access
    return {
      name: 'FinMark Analyst',
      position: 'Business Analyst',
      department: 'Analytics',
      location: 'Singapore',
      role: 'analyst',
      assignedOrganizations: ['maybank', 'sg-general-hospital', 'shopee-sg'],
      permissions: ['view', 'export', 'share'],
      lastActive: new Date().toISOString(),
      avatar: null
    };
  }
  
  // For any other email, still give demo access
  return getDefaultUser();
}; 