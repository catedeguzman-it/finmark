'use client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { SelectUser } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComponentLoading } from '@/components/ui/loading';
import { AppNavbar } from '@/components/ui/app-navbar';
import { Badge } from '@/components/ui/badge';

interface ProfileClientProps {
  user: User;
  dbUser: SelectUser;
}

export default function ProfileClient({ user, dbUser }: ProfileClientProps) {
  const [allUsers, setAllUsers] = useState<SelectUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const users = await response.json();
          setAllUsers(users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <AppNavbar user={dbUser} showBackButton backUrl="/dashboard" />
        <ComponentLoading text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <AppNavbar user={dbUser} showBackButton backUrl="/dashboard" title="User Profile" />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-base">{dbUser.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{dbUser.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Position</p>
                <p className="text-base">{dbUser.position || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <Badge 
                  variant="outline" 
                  className={getRoleBadgeColor(dbUser.role)}
                >
                  {dbUser.role ? dbUser.role.charAt(0).toUpperCase() + dbUser.role.slice(1) : 'Member'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-base">{new Date(dbUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Sign In</p>
                <p className="text-base">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Members</CardTitle>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <p className="text-center text-muted-foreground">No other users found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name || 'Unknown'}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.position || 'Not set'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getRoleBadgeColor(u.role)}`}
                        >
                          {u.role ? u.role.charAt(0).toUpperCase() + u.role.slice(1) : 'Member'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 