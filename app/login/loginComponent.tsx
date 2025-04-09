'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { createUser, useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { InputField } from '../components/account/InputField';
import { SubmitButton } from '../components/account/SubmitButton';

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
      router.push('/golf');
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

      if (response.ok && !data.error && data.accessToken) {
        if (data.message === 'New password required') {
          setUserSession(data.session);
        } else {
          const userTemp = createUser(email, data);
          setUser(userTemp);
          router.push('/golf');
        }
      } else {
        console.error('Login failed:', data?.error);
        setFailureMessage(
          data?.details?.message ||
            data?.error?.message ||
            data?.message ||
            data?.error
        );
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-fit md:h-[80vh] bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded shadow-md">
        {failureMessage && (
          <div className="text-red-500 text-center">{failureMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <InputField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required_prop={true}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required_prop={true}
          />
          {userSession && (
            <InputField
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required_prop={true}
            />
          )}
          <div className="mt-6">
            <SubmitButton
              type="submit"
              label={userSession ? 'Set New Password' : 'Log in'}
            />
            <div className="mt-2 text-center">
              <Link href="/login/create-account">
                <div className="text-sm text-gray-800 hover:text-gray-500">
                  Don&apos;t have an account? Create one
                </div>
              </Link>
            </div>
            <div className="mt-2 text-center">
              <Link href="/login/forgot-password">
                <div className="text-sm text-gray-800 hover:text-gray-500">
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
