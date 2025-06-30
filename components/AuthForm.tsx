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

<<<<<<< HEAD
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
          className="w-full h-10 flex items-center justify-center gap-3 bg-white text-[#5f6368] border border-gray-300 rounded-md font-medium text-sm hover:shadow-md transition-shadow disabled:opacity-60"
        >
          {loading ? (
            <svg
              className="animate-spin w-4 h-4 text-[#5f6368]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            <>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google"
                className="w-2 h-2"
              />
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);
=======
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
>>>>>>> 296a4a1553a307cabf2089da5837884395692a3b
}
