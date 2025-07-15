'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, Home, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { SelectUser } from '@/db/schema';
import { useState } from 'react';

interface AppNavbarProps {
  user: SelectUser;
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
}

export function AppNavbar({ user, showBackButton = false, backUrl = '/dashboard', title }: AppNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyst':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'member':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPageTitle = () => {
    if (title) return title;
    
    switch (pathname) {
      case '/dashboard':
        return 'FinMark Analytics';
      case '/profile':
        return 'User Profile';
      default:
        return 'FinMark';
    }
  };

  return (
    <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton ? (
              <Link 
                href={backUrl} 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Back</span>
              </Link>
            ) : (
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
            )}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getPageTitle()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/profile" 
              className="flex items-center space-x-3 hover:opacity-80 transition"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs font-medium">
                  {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Member'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{user.position || 'No position set'}</p>
              </div>
            </Link>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex items-center space-x-2"
            >
              {signingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span>{signingOut ? 'Signing out...' : 'Sign out'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}