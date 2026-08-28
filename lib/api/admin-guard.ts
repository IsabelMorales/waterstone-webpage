import { redirect } from 'next/navigation';
import { getAdminToken } from '@/lib/api/admin-auth';
import { fetchAdminMe, WaterstoneApiError } from '@/lib/api/waterstone';

function isAuthSessionError(err: unknown): boolean {
  return (
    err instanceof WaterstoneApiError &&
    (err.status === 401 || err.status === 403 || err.status === 404)
  );
}

/**
 * Validates admin JWT + Firestore profile for server pages.
 */
export async function requireAdminPageSession(): Promise<string> {
  const token = await getAdminToken();

  if (!token) {
    redirect('/admin');
  }

  try {
    await fetchAdminMe(token);
    return token;
  } catch (err) {
    if (isAuthSessionError(err)) {
      redirect('/api/admin/session/clear?reason=session_invalid');
    }
    redirect('/admin?reason=api_unavailable');
  }
}

/**
 * On /admin: valid session → listings; stale cookie → clear silently.
 */
export async function resolveAdminLoginPageSession(): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;

  try {
    await fetchAdminMe(token);
    redirect('/admin/listings');
  } catch (err) {
    if (isAuthSessionError(err)) {
      redirect('/api/admin/session/clear');
    }
  }
}
