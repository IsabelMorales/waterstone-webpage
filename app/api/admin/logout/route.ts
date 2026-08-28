import { NextResponse } from 'next/server';
import {
  ADMIN_TOKEN_COOKIE,
  adminCookieOptions,
} from '@/lib/api/admin-auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out.',
  });
  response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
    ...adminCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
