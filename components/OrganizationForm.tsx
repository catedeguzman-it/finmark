'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { createOrganization } from '@/app/admin/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrganizationFormData {
  name: string;
  description: string;
  type: string;
}

export function OrganizationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrganizationFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: 'small_business',
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('type', data.type);
    
    startTransition(async () => {
      try {
        const result = await createOrganization(formData);
        setSuccess(result.message);
        form.reset();
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(null);
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'startup':
      case 'enterprise':
        return <Building2 className="w-4 h-4" />;
      case 'small_business':
      case 'non_profit':
        return <Users className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Building2 className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
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
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              placeholder="Enter organization name"
              disabled={isPending}
              className={cn(
                form.formState.errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
              {...form.register('name', { required: 'Organization name is required' })}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the organization"
              disabled={isPending}
              rows={3}
              {...form.register('description')}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="type">Organization Type</Label>
            <Select
              disabled={isPending}
              onValueChange={(value) => form.setValue('type', value)}
              defaultValue="small_business"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">
                  <div className="flex items-center gap-2">
                    {getTypeIcon('startup')}
                    Startup
                  </div>
                </SelectItem>
                <SelectItem value="small_business">
                  <div className="flex items-center gap-2">
                    {getTypeIcon('small_business')}
                    Small Business
                  </div>
                </SelectItem>
                <SelectItem value="enterprise">
                  <div className="flex items-center gap-2">
                    {getTypeIcon('enterprise')}
                    Enterprise
                  </div>
                </SelectItem>
                <SelectItem value="non_profit">
                  <div className="flex items-center gap-2">
                    {getTypeIcon('non_profit')}
                    Non-Profit
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
      </DialogContent>
    </Dialog>
  );
}