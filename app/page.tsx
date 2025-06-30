import AuthForm from '../components/AuthForm';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-12 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome to FinMark</h1>
          <p className="text-sm text-gray-500">Sign in or create your account to get started</p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
