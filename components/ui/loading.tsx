'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ 
  size = 'md', 
  text = 'Loading...', 
  className,
  fullScreen = false 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 
            className={cn(
              sizeClasses[size], 
              'animate-spin text-blue-600'
            )} 
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-pulse" />
        </div>
        {text && (
          <p className={cn(
            textSizeClasses[size],
            'text-gray-600 font-medium animate-pulse'
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

// Page-specific loading components
export function PageLoading({ text = 'Loading page...' }: { text?: string }) {
  return <Loading size="lg" text={text} fullScreen />;
}

export function ComponentLoading({ text = 'Loading...' }: { text?: string }) {
  return <Loading size="md" text={text} />;
}

export function InlineLoading({ text }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
}