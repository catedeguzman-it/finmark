'use client';

import { useState, useTransition, useEffect } from 'react';
import { SelectUser, SelectOrganization } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SimpleUserInvitationForm } from '@/components/SimpleUserInvitationForm';
import { 
  assignUserToOrganization, 
  removeUserFromOrganizationAction
} from '@/app/profile/actions';
import { 
  UserPlus, 
  Settings, 
  Users, 
  Building2, 
  Plus, 
  Minus,
  Search,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserWithOrganizations {
  user: SelectUser;
  organizations: Array<{
    id: number;
    name: string;
    type: string;
    isDefault: boolean | null;
    joinedAt: Date | null;
  }>;
}

interface PendingChange {
  userId: number;
  organizationId: number;
  action: 'assign' | 'remove';
  organizationName: string;
}

interface EnhancedMemberManagementProps {
  members: Array<{
    user: SelectUser;
    organizations: {
      id: number | null;
      name: string | null;
      type: string | null;
      isDefault: boolean | null;
      joinedAt: Date | null;
    };
  }>;
  organizations: SelectOrganization[];
  currentUserId: number;
}

export function EnhancedMemberManagement({ 
  members, 
  organizations, 
  currentUserId 
}: EnhancedMemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<SelectUser | null>(null);
  const [isOrgAssignDialogOpen, setIsOrgAssignDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Local state for pending changes
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [localMembers, setLocalMembers] = useState(members);

  // Update local members when props change
  useEffect(() => {
    setLocalMembers(members);
  }, [members]);

  // Group members by user to show multiple organizations per user
  const groupedMembers = localMembers.reduce((acc, member) => {
    const userId = member.user.id;
    if (!acc[userId]) {
      acc[userId] = {
        user: member.user,
        organizations: []
      };
    }
    if (member.organizations.id) {
      acc[userId].organizations.push({
        id: member.organizations.id,
        name: member.organizations.name || '',
        type: member.organizations.type || '',
        isDefault: member.organizations.isDefault,
        joinedAt: member.organizations.joinedAt
      });
    }
    return acc;
  }, {} as Record<number, UserWithOrganizations>);

  const usersWithOrgs = Object.values(groupedMembers);

  // Filter users based on search
  const filteredUsers = usersWithOrgs.filter(userWithOrgs => {
    const user = userWithOrgs.user;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.position?.toLowerCase().includes(searchLower) ||
      userWithOrgs.organizations.some(org => 
        org.name.toLowerCase().includes(searchLower)
      )
    );
  });

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

  const handleAssignOrganization = (userId: number, organizationId: number) => {
    const organization = organizations.find(org => org.id === organizationId);
    if (!organization) return;

    // Add to pending changes
    const newChange: PendingChange = {
      userId,
      organizationId,
      action: 'assign',
      organizationName: organization.name
    };

    // Remove any conflicting pending changes for this user/org combination
    const filteredChanges = pendingChanges.filter(
      change => !(change.userId === userId && change.organizationId === organizationId)
    );
    setPendingChanges([...filteredChanges, newChange]);

    // Update local state immediately for UI feedback
    setLocalMembers(prev => {
      const updated = [...prev];
      const existingMemberIndex = updated.findIndex(m => m.user.id === userId);
      
      if (existingMemberIndex >= 0) {
        // User exists, add organization if not already present
        const member = updated[existingMemberIndex];
        if (!member.organizations.id || member.organizations.id !== organizationId) {
          // Create new member entry with this organization
          updated.push({
            user: member.user,
            organizations: {
              id: organizationId,
              name: organization.name,
              type: organization.type || '',
              isDefault: false,
              joinedAt: new Date()
            }
          });
        }
      }
      return updated;
    });
  };

  const handleRemoveFromOrganization = (userId: number, organizationId: number) => {
    const organization = organizations.find(org => org.id === organizationId);
    if (!organization) return;

    // Add to pending changes
    const newChange: PendingChange = {
      userId,
      organizationId,
      action: 'remove',
      organizationName: organization.name
    };

    // Remove any conflicting pending changes for this user/org combination
    const filteredChanges = pendingChanges.filter(
      change => !(change.userId === userId && change.organizationId === organizationId)
    );
    setPendingChanges([...filteredChanges, newChange]);

    // Update local state immediately for UI feedback
    setLocalMembers(prev => 
      prev.filter(member => 
        !(member.user.id === userId && member.organizations.id === organizationId)
      )
    );
  };

  const handleConfirmChanges = async () => {
    if (pendingChanges.length === 0) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        // Process all pending changes
        for (const change of pendingChanges) {
          const formData = new FormData();
          formData.append('userId', change.userId.toString());
          formData.append('organizationId', change.organizationId.toString());

          if (change.action === 'assign') {
            formData.append('isDefault', 'false');
            await assignUserToOrganization(formData);
          } else {
            await removeUserFromOrganizationAction(formData);
          }
        }

        setSuccess(`Successfully applied ${pendingChanges.length} changes`);
        setPendingChanges([]);
        setIsOrgAssignDialogOpen(false);
        
        // Refresh the page to get the latest data
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while applying changes');
        // Revert local changes on error
        setLocalMembers(members);
        setPendingChanges([]);
      }
    });
  };

  const handleCancelChanges = () => {
    setPendingChanges([]);
    setLocalMembers(members);
    setError(null);
    setSuccess(null);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && pendingChanges.length > 0) {
      // If there are pending changes, ask for confirmation
      if (confirm('You have pending changes. Are you sure you want to close without saving?')) {
        handleCancelChanges();
        setIsOrgAssignDialogOpen(false);
        setSelectedUser(null);
      }
    } else {
      setIsOrgAssignDialogOpen(open);
      if (!open) {
        setSelectedUser(null);
        // Clear any pending changes when closing
        if (pendingChanges.length > 0) {
          handleCancelChanges();
        }
      }
    }
  };

  const getUnassignedOrganizations = (userOrgs: UserWithOrganizations['organizations']) => {
    const assignedOrgIds = userOrgs.map(org => org.id);
    return organizations.filter(org => !assignedOrgIds.includes(org.id));
  };

  const isPendingChange = (userId: number, organizationId: number, action: 'assign' | 'remove') => {
    return pendingChanges.some(
      change => change.userId === userId && 
                change.organizationId === organizationId && 
                change.action === action
    );
  };

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

      {/* Pending Changes Indicator - Just shows summary, no buttons */}
      {pendingChanges.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <span className="font-medium text-orange-800">
              {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''} - open a user's management dialog to confirm
            </span>
            <div className="text-sm text-orange-700 mt-1">
              {pendingChanges.map((change, index) => (
                <div key={index}>
                  {change.action === 'assign' ? 'Assign' : 'Remove'} {change.organizationName}
                </div>
              ))}
            </div>
          </AlertDescription>
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

      {/* Members with Organization Assignments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members & Organization Access ({filteredUsers.length})
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No members found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((userWithOrgs) => (
                <div key={userWithOrgs.user.id} className="border rounded-lg p-4 space-y-3">
                  {/* User Info Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {userWithOrgs.user.name || 'Unknown'}
                        </h4>
                        <p className="text-sm text-gray-600">{userWithOrgs.user.email}</p>
                        <p className="text-sm text-gray-500">
                          {userWithOrgs.user.position || 'No position set'}
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRoleBadgeColor(userWithOrgs.user.role)}`}
                      >
                        {userWithOrgs.user.role ? 
                          userWithOrgs.user.role.charAt(0).toUpperCase() + userWithOrgs.user.role.slice(1) : 
                          'Member'
                        }
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(userWithOrgs.user);
                        setIsOrgAssignDialogOpen(true);
                      }}
                      disabled={isPending}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage Access
                    </Button>
                  </div>

                  {/* Organization Assignments */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Organization Access ({userWithOrgs.organizations.length})
                    </h5>
                    {userWithOrgs.organizations.length === 0 ? (
                      <p className="text-sm text-gray-500 ml-5">No organization access assigned</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-5">
                        {userWithOrgs.organizations.map((org) => (
                          <div key={org.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-800">{org.name}</p>
                              <p className="text-xs text-green-600">
                                {org.type} • Joined {org.joinedAt ? new Date(org.joinedAt).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromOrganization(userWithOrgs.user.id, org.id)}
                              disabled={isPending || userWithOrgs.user.id === currentUserId}
                              className="text-red-600 hover:bg-red-50 h-6 w-6 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Assignment Dialog */}
      <Dialog open={isOrgAssignDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage Organization Access</DialogTitle>
            {pendingChanges.length > 0 && (
              <div className="text-sm text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''} - click Confirm Changes to apply
              </div>
            )}
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">User: {selectedUser.name || selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.position || 'No position set'}</p>
              </div>
              
              {(() => {
                const userWithOrgs = usersWithOrgs.find(u => u.user.id === selectedUser.id);
                const assignedOrgs = userWithOrgs?.organizations || [];
                const unassignedOrgs = getUnassignedOrganizations(assignedOrgs);
                
                return (
                  <Tabs defaultValue="assigned" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="assigned" className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4" />
                        <span>Assigned ({assignedOrgs.length})</span>
                      </TabsTrigger>
                      <TabsTrigger value="available" className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Available ({unassignedOrgs.length})</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="assigned">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {assignedOrgs.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No organizations assigned
                            </p>
                          ) : (
                            assignedOrgs.map((org) => {
                              const pendingRemove = isPendingChange(selectedUser.id, org.id, 'remove');
                              return (
                                <div key={org.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                                  pendingRemove 
                                    ? 'bg-red-50 border-red-200 opacity-60' 
                                    : 'bg-green-50 border-green-200'
                                }`}>
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${pendingRemove ? 'text-red-800 line-through' : 'text-green-800'}`}>
                                      {org.name}
                                      {pendingRemove && <span className="ml-2 text-xs">(Pending removal)</span>}
                                    </h4>
                                    <p className={`text-sm ${pendingRemove ? 'text-red-600' : 'text-green-600'}`}>
                                      {org.type} • Joined {org.joinedAt ? new Date(org.joinedAt).toLocaleDateString() : 'Unknown'}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveFromOrganization(selectedUser.id, org.id)}
                                    disabled={isPending || pendingRemove}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <Minus className="h-4 w-4 mr-1" />
                                    {pendingRemove ? 'Pending' : 'Remove'}
                                  </Button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="available">
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {unassignedOrgs.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              All organizations are assigned
                            </p>
                          ) : (
                            unassignedOrgs.map((org) => {
                              const pendingAssign = isPendingChange(selectedUser.id, org.id, 'assign');
                              return (
                                <div key={org.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                                  pendingAssign 
                                    ? 'bg-green-50 border-green-200' 
                                    : 'hover:bg-gray-50'
                                }`}>
                                  <div className="flex-1">
                                    <h4 className={`font-medium ${pendingAssign ? 'text-green-800' : 'text-gray-900'}`}>
                                      {org.name}
                                      {pendingAssign && <span className="ml-2 text-xs">(Pending assignment)</span>}
                                    </h4>
                                    <p className={`text-sm ${pendingAssign ? 'text-green-600' : 'text-gray-600'}`}>
                                      {org.type} • {org.description || 'No description'}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAssignOrganization(selectedUser.id, org.id)}
                                    disabled={isPending || pendingAssign}
                                    className="text-green-600 border-green-200 hover:bg-green-50"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    {pendingAssign ? 'Pending' : 'Assign'}
                                  </Button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                );
              })()}
            </div>
          )}
          
          {/* Dialog Footer with Confirm/Cancel buttons */}
          <DialogFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-muted-foreground">
                {pendingChanges.length > 0 ? (
                  <span className="text-orange-600 font-medium">
                    {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>No pending changes</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCancelChanges}
                  disabled={isPending || pendingChanges.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel Changes
                </Button>
                <Button
                  onClick={handleConfirmChanges}
                  disabled={isPending || pendingChanges.length === 0}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isPending ? 'Applying...' : `Confirm ${pendingChanges.length > 0 ? pendingChanges.length : ''} Change${pendingChanges.length !== 1 ? 's' : ''}`}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}