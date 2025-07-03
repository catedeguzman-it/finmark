import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-12 space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
          <p className="text-gray-600">
            There was an error with your authentication. This could be due to:
          </p>
          <ul className="text-sm text-gray-500 text-left space-y-2">
            <li>• Invalid email or password</li>
            <li>• Account not confirmed</li>
            <li>• Network connection issues</li>
          </ul>
        </div>
        
        <Link 
          href="/login" 
          className="inline-block btn-primary text-center"
        >
          Try Again
        </Link>
      </div>
    </main>
  );
} 