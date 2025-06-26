'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/app/login/actions'; // adjust path to your server action
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await login(formData);
      // login() redirects on success, so this code is likely never reached
    } catch (err: any) {
      setError('Invalid email or password');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <Input name="email" type="email" placeholder="Email" className="mb-4" disabled={loading} required />
        <Input name="password" type="password" placeholder="Password" className="mb-4" disabled={loading} required />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
}
