'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { inviteUserToSystem } from '@/app/profile/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, UserPlus, Building2, Users, BarChart3, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'analyst', 'viewer'], {
    required_error: 'Please select a role',
  }),
  position: z.string().optional(),
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

export function SimpleUserInvitationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'viewer',
      position: '',
    },
  });

  const onSubmit = async (data: InviteUserFormData) => {
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('role', data.role);
    formData.append('position', data.position || '');
    
    startTransition(async () => {
      try {
        const result = await inviteUserToSystem(formData);
        setSuccess(result.message);
        form.reset();
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Building2 className="w-4 h-4" />;
      case 'manager': return <Users className="w-4 h-4" />;
      case 'analyst': return <BarChart3 className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin': return 'Full access to all features';
      case 'manager': return 'Manage teams and projects';
      case 'analyst': return 'View and analyze data';
      case 'viewer': return 'Read-only access';
      default: return 'Read-only access';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#26C6DA] hover:bg-[#00ACC1]">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite New User</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              disabled={isPending}
              className={cn(
                form.formState.errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="position">Position (Optional)</Label>
            <Input
              id="position"
              placeholder="e.g., Financial Analyst, CFO, Manager"
              disabled={isPending}
              className={cn(
                form.formState.errors.position && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              {...form.register('position')}
            />
            {form.formState.errors.position && (
              <p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">System Role</Label>
            <Select
              disabled={isPending}
              onValueChange={(value) => form.setValue('role', value as any)}
              defaultValue="viewer"
            >
              <SelectTrigger className={cn(
                form.formState.errors.role && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['admin', 'manager', 'analyst', 'viewer'].map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role)}
                      <div>
                        <div className="font-medium capitalize">{role}</div>
                        <div className="text-xs text-gray-500">{getRoleDescription(role)}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              The user will receive an email invitation to join the system. Organization assignment can be done after they accept the invitation.
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-[#26C6DA] hover:bg-[#00ACC1]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}