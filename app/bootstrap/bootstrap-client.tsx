'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { createRootAdmin } from './actions';

export default function BootstrapClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemState, setSystemState] = useState<{ hasUsers: boolean; needsBootstrap: boolean } | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkSystemState();
  }, []);

  const checkSystemState = async () => {
    try {
      const response = await fetch('/api/system-state');
      const data = await response.json();
      setSystemState(data);
      
      // If system already has users, redirect to login
      if (data.hasUsers) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to check system state:', error);
      setError('Failed to check system state. Please try again.');
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await createRootAdmin(formData);
      // Success - redirect will happen in the server action
    } catch (error: any) {
      setError(error.message || 'Failed to create root admin account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!systemState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking system state...</span>
        </div>
      </div>
    );
  }

  if (systemState.hasUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Redirecting to login...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to FinMark</h1>
          <p className="text-sm text-gray-500">
            Set up your root administrator account to get started
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a secure password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-[#26C6DA] hover:bg-[#00ACC1] text-white font-semibold py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Root Admin Account'
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This account will have full administrative privileges.
          </p>
          <p className="text-xs text-gray-500">
            You can invite other users after setup is complete.
          </p>
        </div>
      </div>
    </main>
  );
}