'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserPermissions } from '@/hooks/use-user-permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Building2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  description: z.string().optional(),
  type: z.enum(['startup', 'small_business', 'enterprise', 'non_profit'], {
    required_error: 'Please select an organization type',
  }),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

interface OrganizationCreationFlowProps {
  onOrganizationCreated?: (organization: any) => void;
}

export function OrganizationCreationFlow({ onOrganizationCreated }: OrganizationCreationFlowProps) {
  const { hasPermission } = useUserPermissions();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      description: '',
      type: undefined,
    },
  });

  if (!hasPermission('manage_organization')) {
    return null;
  }

  const onSubmit = async (data: OrganizationFormData) => {
    setError(null);
    setSuccess(null);
    
    startTransition(async () => {
      try {
        // This would be replaced with actual API call
        console.log('Creating organization:', data);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess('Organization created successfully!');
        form.reset();
        
        if (onOrganizationCreated) {
          onOrganizationCreated({
            id: Date.now(),
            name: data.name,
            description: data.description,
            type: data.type,
            createdAt: new Date(),
          });
        }
        
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create organization');
      }
    });
  };

  const organizationTypes = [
    { value: 'startup', label: 'Startup', description: 'Early-stage company' },
    { value: 'small_business', label: 'Small Business', description: 'Established small business' },
    { value: 'enterprise', label: 'Enterprise', description: 'Large corporation' },
    { value: 'non_profit', label: 'Non-Profit', description: 'Non-profit organization' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Create New Organization
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="Enter organization name"
                disabled={isPending}
                className={cn(
                  form.formState.errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="type">Organization Type</Label>
              <Select
                disabled={isPending}
                onValueChange={(value) => form.setValue('type', value as any)}
              >
                <SelectTrigger className={cn(
                  form.formState.errors.type && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-600">{form.formState.errors.type.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter organization description"
                disabled={isPending}
                rows={3}
                {...form.register('description')}
              />
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
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Organization'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}