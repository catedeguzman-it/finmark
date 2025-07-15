'use client';

import { useState, useEffect, useTransition } from 'react';
import { SelectUser, SelectOrganization, SelectUserInvitation } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleUserInvitationForm } from '@/components/SimpleUserInvitationForm';
import { assignUserToOrganization, updateUserOrganizationRole, getPendingInvitations } from '@/app/profile/actions';
import { UserPlus, Settings, Clock, XCircle, Users } from 'lucide-react';

interface MemberWithOrganization {
  user: SelectUser;
  organization: {
    id: number | null;
    role: string | null;
    joinedAt: Date | null;
  };
}

interface MemberManagementProps {
  members: MemberWithOrganization[];
  organizations: SelectOrganization[];
  currentUserId: number;
}

export function MemberManagement({ members, organizations, currentUserId }: MemberManagementProps) {
  const [pendingInvitations, setPendingInvitations] = useState<SelectUserInvitation[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const invitations = await getPendingInvitations();
        setPendingInvitations(invitations);
      } catch (error) {
        console.error('Error fetching invitations:', error);
      }
    };

    fetchInvitations();
  }, []);

  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyst':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAssignUser = async (userId: number, organizationId: number, role: string) => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('organizationId', organizationId.toString());
    formData.append('role', role);

    startTransition(async () => {
      try {
        const result = await assignUserToOrganization(formData);
        setSuccess(result.message);
        setIsAssignDialogOpen(false);
        setSelectedUser(null);
        // Refresh the page to show updated data
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const handleUpdateRole = async (userId: number, organizationId: number, newRole: string) => {
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('organizationId', organizationId.toString());
    formData.append('role', newRole);

    startTransition(async () => {
      try {
        const result = await updateUserOrganizationRole(formData);
        setSuccess(result.message);
        // Refresh the page to show updated data
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const unassignedUsers = members.filter(m => !m.organization.id);
  const assignedUsers = members.filter(m => m.organization.id);

  return (
    <div className="space-y-6">
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

      {/* Invite Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite New Users
          </CardTitle>
          <SimpleUserInvitationForm />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Invite new users to join your organization. They will receive an email with instructions to set up their account.
          </p>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Invitations ({pendingInvitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{invitation.position || 'Not specified'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRoleBadgeColor(invitation.role)}`}
                      >
                        {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusBadgeColor(invitation.status)}`}
                      >
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(invitation.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invitation.expiresAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Organization Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Organization Members ({assignedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No users assigned to organizations yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Organization Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedUsers.map((member) => (
                  <TableRow key={member.user.id}>
                    <TableCell className="font-medium">{member.user.name || 'Unknown'}</TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.user.position || 'Not set'}</TableCell>
                    <TableCell>
                      <Select
                        disabled={isPending || member.user.id === currentUserId}
                        defaultValue={member.organization.role || 'member'}
                        onValueChange={(newRole) => 
                          handleUpdateRole(member.user.id, member.organization.id!, newRole)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {member.user.id === currentUserId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Cannot modify your own role
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {member.organization.joinedAt 
                        ? new Date(member.organization.joinedAt).toLocaleDateString()
                        : 'Unknown'
                      }
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" disabled={isPending}>
                        <Settings className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Unassigned Users */}
      {unassignedUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-orange-500" />
              Unassigned Users ({unassignedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unassignedUsers.map((member) => (
                  <TableRow key={member.user.id}>
                    <TableCell className="font-medium">{member.user.name || 'Unknown'}</TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.user.position || 'Not set'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRoleBadgeColor(member.user.role)}`}
                      >
                        {member.user.role ? member.user.role.charAt(0).toUpperCase() + member.user.role.slice(1) : 'Member'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(member.user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(member.user);
                          setIsAssignDialogOpen(true);
                        }}
                        disabled={isPending}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Assign User Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign User to Organization</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">User: {selectedUser.name || selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {organizations.map((org) => (
                  <div key={org.id} className="space-y-2">
                    <h4 className="font-medium">{org.name}</h4>
                    <div className="space-y-1">
                      {['admin', 'manager', 'analyst', 'viewer'].map((role) => (
                        <Button
                          key={role}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => handleAssignUser(selectedUser.id, org.id, role)}
                          disabled={isPending}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}