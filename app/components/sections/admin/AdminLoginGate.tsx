'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginGateProps {
  notice: string | null;
  hasToken: boolean;
}

export default function AdminLoginGate({ notice, hasToken }: AdminLoginGateProps) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(!hasToken);

  useEffect(() => {
    if (!hasToken) return;

    let active = true;

    async function checkSession() {
      try {
        const response = await fetch('/api/admin/me', { cache: 'no-store' });
        if (!active) return;

        if (response.ok) {
          router.replace('/admin/listings');
          return;
        }

        setShowLogin(true);
      } catch {
        if (active) setShowLogin(true);
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [hasToken, router]);

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-gray-400 tracking-wide">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4 py-16">
      <AdminLoginForm notice={notice} />
    </div>
  );
}
