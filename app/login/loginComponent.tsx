'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { createUser, useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';

function LoginContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userSession, setUserSession] = useState(null);
  const [origin, setOrigin] = useState<string>('');
  const { user, setUser } = useUser();
  const router = useRouter();
  const [failureMessage, setFailureMessage] = useState('');

  // if (user) {
  //   router.push('/account');
  // }

  React.useEffect(() => {
    if (user) {
      router.push('/account');
    }
  }, [user, router]);

  React.useEffect(() => {
    const tempOrigin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : '';

    setOrigin(tempOrigin);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = userSession
      ? JSON.stringify({
          username: email,
          password: newPassword,
          session: userSession,
        })
      : JSON.stringify({ username: email, password });

    try {
      setFailureMessage('');
      const response = await fetch(`${origin}/login/api`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        if (data.message === 'New password required') {
          setUserSession(data.session);
        } else {
          const userTemp = createUser(email, data);
          setUser(userTemp);
        }
      } else {
        console.error('Login failed:', data.error);
        setFailureMessage(
          data?.details?.message ||
            data?.error?.message ||
            data?.message ||
            data?.error,
        );
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded shadow-md">
        {failureMessage && (
          <div className="text-red-500 text-center">{failureMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {userSession && (
            <div className="mt-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          )}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {userSession ? 'Set New Password' : 'Log in'}
            </button>
            <div className="mt-2 text-center">
              <Link href="/login/create-account">
                <div className="text-sm text-indigo-600 hover:text-indigo-500">
                  Don&apos;t have an account? Create one
                </div>
              </Link>
            </div>
            <div className="mt-2 text-center">
              <Link href="/login/forgot-password">
                <div className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot your password? Reset it
                </div>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginContainer;
