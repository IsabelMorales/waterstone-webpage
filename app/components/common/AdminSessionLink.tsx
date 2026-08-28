'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Discreet link back to listings admin — only rendered when an admin session exists.
 */
export default function AdminSessionLink() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    async function check() {
      try {
        const response = await fetch('/api/admin/me');
        if (active && response.ok) setVisible(true);
      } catch {
        // Not signed in — keep hidden
      }
    }
    void check();
    return () => {
      active = false;
    };
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/admin/listings"
      className="text-xs text-gray-500 hover:text-brand-accent transition-colors"
    >
      Manage listings
    </Link>
  );
}
