'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('message') || 'An unknown error occurred';

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-red-300 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Authentication Error</h1>
            <p className="text-sm text-gray-600 mt-2">There was a problem with your authentication</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
          <p className="text-sm text-red-700 break-words">{error}</p>
        </div>
        
        <div className="space-y-3">
          <Link 
            href="/login"
            className="w-full bg-[#26C6DA] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#00ACC1] focus:ring-2 focus:ring-[#26C6DA] focus:ring-offset-2 transition duration-150 ease-in-out shadow-sm text-center block"
          >
            Try Again
          </Link>
          
          <Link 
            href="/"
            className="w-full py-3 px-4 text-[#26C6DA] font-semibold rounded-lg border border-[#26C6DA] hover:bg-[#26C6DA] hover:text-white focus:ring-2 focus:ring-[#26C6DA] focus:ring-offset-2 transition duration-150 ease-in-out text-center block"
          >
            Go Home
          </Link>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    </main>
  );
} 