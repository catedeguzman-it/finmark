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
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
      <h2 className="text-xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button onClick={handleAuth} className="bg-blue-500 text-white w-full py-2 mt-2 rounded">
        {isSignUp ? 'Create Account' : 'Login'}
      </button>
      <p
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-blue-600 text-sm text-center mt-2 cursor-pointer"
      >
        {isSignUp ? 'Already have an account?' : 'Need to create an account?'}
      </p>
    </div>
  );
}
