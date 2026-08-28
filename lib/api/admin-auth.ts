import { cookies } from 'next/headers';

export const ADMIN_TOKEN_COOKIE = 'ws_admin_token';

const isProd = process.env.NODE_ENV === 'production';

export function adminCookieOptions(maxAgeSeconds = 3600) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

export async function getAdminToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ADMIN_TOKEN_COOKIE)?.value;
}
