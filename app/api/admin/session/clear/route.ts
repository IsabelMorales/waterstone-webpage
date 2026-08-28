import { NextResponse } from 'next/server';
import {
  ADMIN_TOKEN_COOKIE,
  adminCookieOptions,
} from '@/lib/api/admin-auth';

const ALLOWED_REASONS = new Set(['session_invalid']);

/**
 * Clears the admin session cookie (Route Handler only — not allowed in RSC).
 * GET /api/admin/session/clear
 * GET /api/admin/session/clear?reason=session_invalid
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reasonParam = url.searchParams.get('reason');
  const redirectUrl =
    reasonParam && ALLOWED_REASONS.has(reasonParam)
      ? new URL(`/admin?reason=${reasonParam}`, url.origin)
      : new URL('/admin', url.origin);

  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
    ...adminCookieOptions(0),
    maxAge: 0,
  });

  return response;
}
