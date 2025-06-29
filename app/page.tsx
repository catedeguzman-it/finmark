import AuthForm from '../components/AuthForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to FinMark
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Sign in or create your account to get started
        </p>
        <AuthForm />
      </div>
    </main>
  );
}
