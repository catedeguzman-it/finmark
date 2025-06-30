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

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({ email, password });
        if (!result.error && !result.data.session) {
          setMessage('Check your email to confirm your account.');
          setLoading(false);
          return;
        }
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      const { error } = result;
      if (error) {
        setError(error.message);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
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
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#e0f7fa] px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 sm:p-10 transition-all">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#26C6DA] mb-6">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <div className="space-y-5">
          <input
            type="email"
            name="email"
            id="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            id="password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#26C6DA] placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          <button
            onClick={handleAuth}
            disabled={loading}
            className={`w-full py-3 ${
              loading ? 'bg-gray-400' : 'bg-[#26C6DA] hover:bg-[#1ca7b8]'
            } text-white font-medium rounded-lg transition-colors`}
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
          </button>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-10 flex items-center justify-center gap-3 bg-white text-[#5f6368] border border-gray-300 rounded-md font-medium text-sm hover:shadow-md transition-shadow"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-3 h-3"
            />
            Sign in with Google
          </button>

          <p
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            className="text-sm text-center text-[#26C6DA] mt-2 cursor-pointer hover:underline transition"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'New here? Create an account'}
          </p>
        </div>
      </div>
    </div>
  );
}
