'use client';
import { useEffect, useState, useTransition } from 'react';
import { User } from '@supabase/supabase-js';
import { SelectUser, SelectOrganization } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ComponentLoading } from '@/components/ui/loading';
import { AppNavbar } from '@/components/ui/app-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedMemberManagement } from '@/components/EnhancedMemberManagement';
import { canManageUsers } from '@/lib/rbac';
import { getOrganizationMembersWithMultipleOrgs, updateProfile } from './actions';
import { Edit, Save, X } from 'lucide-react';

interface MemberWithOrganizations {
  user: SelectUser;
  organizations: {
    id: number | null;
    name: string | null;
    type: string | null;
    isDefault: boolean | null;
    joinedAt: Date | null;
  };
}

interface ProfileClientProps {
  user: User;
  dbUser: SelectUser;
}

function ProfileEditForm({ dbUser }: { dbUser: SelectUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(dbUser.name || '');
  const [position, setPosition] = useState(dbUser.position || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);

    startTransition(async () => {
      try {
        const result = await updateProfile(formData);
        setSuccess(result.message);
        setIsEditing(false);
        // Refresh the page to show updated data
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const handleCancel = () => {
    setName(dbUser.name || '');
    setPosition(dbUser.position || '');
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Full Name</p>
          <p className="text-base">{dbUser.name || 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Position</p>
          <p className="text-base">{dbUser.position || 'Not set'}</p>
        </div>
        <div className="md:col-span-2">
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Enter your position"
            disabled={isPending}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} size="sm">
          <Save className="w-4 h-4 mr-2" />
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleCancel}
          disabled={isPending}
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface ProfileClientProps {
  user: User;
  dbUser: SelectUser;
}

export default function ProfileClient({ user, dbUser }: ProfileClientProps) {
  const [allUsers, setAllUsers] = useState<MemberWithOrganizations[]>([]);
  const [members, setMembers] = useState<MemberWithOrganizations[]>([]);
  const [organizations, setOrganizations] = useState<SelectOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = canManageUsers(dbUser.role as any);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAdmin) {
          // Fetch organization members and organizations for admin users
          const { members: orgMembers, organizations: orgs } = await getOrganizationMembersWithMultipleOrgs();
          // Transform the data to match our interface
          const transformedMembers = orgMembers.map(member => ({
            user: member.user,
            organizations: member.organizations ? {
              id: member.organizations.id,
              name: member.organizations.name,
              type: member.organizations.type,
              isDefault: member.organizations.isDefault,
              joinedAt: member.organizations.joinedAt
            } : {
              id: null,
              name: null,
              type: null,
              isDefault: null,
              joinedAt: null
            }
          }));
          setMembers(transformedMembers);
          setOrganizations(orgs);
        } else {
          // Fetch all users with organization details for non-admin users
          const response = await fetch('/api/users');
          if (response.ok) {
            const users = await response.json();
            setAllUsers(users);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAdmin]);

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
            <ProfileEditForm dbUser={dbUser} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{dbUser.email}</p>
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

        {isAdmin ? (
          <EnhancedMemberManagement 
            members={members}
            organizations={organizations}
            currentUserId={dbUser.id}
          />
        ) : (
          <div className="space-y-6">
            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{allUsers.length}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {allUsers.filter(u => u.user.isOnboarded).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {allUsers.filter(u => u.organizations?.id).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Assigned to Orgs</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {allUsers.filter(u => u.user.role === 'admin').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Administrators</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users in System</CardTitle>
              </CardHeader>
              <CardContent>
              {allUsers.length === 0 ? (
                <p className="text-center text-muted-foreground">No users found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>System Role</TableHead>
                      <TableHead>Organization</TableHead>
                       <TableHead>Org Status</TableHead>                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map((userWithOrg) => (
                      <TableRow key={userWithOrg.user.id}>
                        <TableCell className="font-medium">{userWithOrg.user.name || 'Unknown'}</TableCell>
                        <TableCell>{userWithOrg.user.email}</TableCell>
                        <TableCell>{userWithOrg.user.position || 'Not set'}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRoleBadgeColor(userWithOrg.user.role)}`}
                          >
                            {userWithOrg.user.role ? userWithOrg.user.role.charAt(0).toUpperCase() + userWithOrg.user.role.slice(1) : 'Member'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {userWithOrg.organizations?.name ? (
                            <span className="text-sm font-medium">{userWithOrg.organizations.name}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {userWithOrg.organizations?.isDefault ? (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                            >
                              Default
                            </Badge>
                          ) : userWithOrg.organizations ? (
                            <span className="text-sm text-muted-foreground">Assigned</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${userWithOrg.user.isOnboarded ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}
                          >
                            {userWithOrg.user.isOnboarded ? 'Active' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(userWithOrg.user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          </div>
        )}
      </main>
    </div>
  );
} 