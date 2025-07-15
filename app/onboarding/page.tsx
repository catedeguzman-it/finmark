'use client';

import { useState, useTransition, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import { onboardUser } from './actions';
import { onboardingSchema, type OnboardingFormData } from '@/lib/validations/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token');

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      invitationToken: invitationToken || undefined,
    },
  });

  const onSubmit = async (data: OnboardingFormData) => {
    setError(null);
    
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.invitationToken) {
      formData.append('invitationToken', data.invitationToken);
    }
    
    startTransition(async () => {
      try {
        await onboardUser(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <UserCheck className="w-12 h-12 text-[#26C6DA]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome to FinMark</h1>
          <p className="text-sm text-gray-500">
            {invitationToken 
              ? "Complete your profile to join your organization" 
              : "Please provide your full name to get started"
            }
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
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

          {invitationToken && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                You've been invited to join an organization. Your role and position will be assigned automatically.
              </p>
            </div>
          )}

          <Button 
            type="submit"
            disabled={isPending}
            className="w-full bg-[#26C6DA] hover:bg-[#00ACC1] text-white font-semibold py-3"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {invitationToken ? 'Joining Organization...' : 'Completing Setup...'}
              </>
            ) : (
              invitationToken ? 'Join Organization' : 'Complete Setup'
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
        <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-[#26C6DA] animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Loading...</h1>
          </div>
        </div>
      </main>
    }>
      <OnboardingForm />
    </Suspense>
  );
}
