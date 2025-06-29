'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) return setError(error.message);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center text-[#26C6DA] mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA]"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA]"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-[#26C6DA] text-white font-semibold py-2 rounded-lg hover:bg-[#1fb3c3] transition"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <p
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-center text-[#26C6DA] mt-2 cursor-pointer hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </p>
        </div>
      </div>
    </div>
  );
}
