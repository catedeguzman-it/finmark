'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../lib/supabaseClient';

export default function AuthForm() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Both email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const { error, data } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setError(error.message);
      } else if (isSignUp && !data.session) {
        setMessage('Check your email to confirm your account.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  setError('');
  setLoading(true);
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  } catch {
    setError('Google login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

return (
  <div className="space-y-6">
    {/* Email Field */}
    <div className="space-y-1">
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
        placeholder="e.g. you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    {/* Password Field */}
    <div className="space-y-1">
      <label htmlFor="password" className="text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        type="password"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    {/* Message/Error */}
    {(error || message) && (
      <p className={`text-sm text-center ${error ? 'text-red-500' : 'text-green-600'}`}>
        {error || message}
      </p>
    )}

    {/* Login Button */}
    <button
      onClick={handleAuth}
      disabled={loading}
      className="btn-primary mt-2"
    >
      {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
    </button>

    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 text-gray-500">or</span>
      </div>
    </div>

    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full py-2 px-4 flex items-center justify-center bg-white text-[#5f6368] border border-gray-300 rounded-md font-medium text-sm hover:shadow-md transition-shadow"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-4 h-4 object-contain"
        style={{ width: '40px', height: '40px', padding: '5px', backgroundColor: '#fff' }}
      />
      <span>Sign in with Google</span>
    </button>

    {/* Toggle Link */}
    <span
      role="button"
      tabIndex={0}
      onClick={() => {
        setIsSignUp(!isSignUp);
        setError('');
      }}
      className="text-sm text-center text-[#26C6DA] mt-2 cursor-pointer hover:underline transition block"
    >
      {isSignUp
        ? 'Already have an account? Sign in'
        : 'New here? Create an account'}
    </span>
  </div>
);
}
