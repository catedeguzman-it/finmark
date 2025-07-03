import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-12 space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Welcome to FinMark</h1>
          <p className="text-sm text-gray-500">Sign in or create your account to get started</p>
        </div>
        
        <form className="space-y-6">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
              placeholder="e.g. you@email.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
              placeholder="Your password"
            />
          </div>

          <div className="space-y-4">
            <button formAction={login} className="btn-primary">
              Log in
            </button>
            
            <button formAction={signup} className="w-full py-2.5 text-[#26C6DA] font-semibold rounded-lg border border-[#26C6DA] hover:bg-[#26C6DA] hover:text-white transition duration-150 ease-in-out">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 