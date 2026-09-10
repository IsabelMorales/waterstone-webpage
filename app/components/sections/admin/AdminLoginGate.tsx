'use client';

import { useEffect, useState } from 'react';
import AdminLoginForm from './AdminLoginForm';

interface AdminLoginGateProps {
  notice: string | null;
  hasToken: boolean;
}

export default function AdminLoginGate({
  notice,
  hasToken,
}: AdminLoginGateProps) {
  const [showLogin, setShowLogin] = useState(!hasToken);

  useEffect(() => {
    if (!hasToken) return;

    let active = true;

    async function checkSession() {
      try {
        const response = await fetch('/api/admin/me', {
          cache: 'no-store',
          credentials: 'same-origin',
        });
        if (!active) return;

        if (response.ok) {
          window.location.assign('/admin/listings');
          return;
        }

        window.location.assign(
          '/api/admin/session/clear?reason=session_invalid'
        );
      } catch {
        if (active) setShowLogin(true);
      }
    }

    void checkSession();

    return () => {
      active = false;
    };
  }, [hasToken]);

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
