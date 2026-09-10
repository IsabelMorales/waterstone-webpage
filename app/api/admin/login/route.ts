import { NextResponse } from 'next/server';
import {
  ADMIN_TOKEN_COOKIE,
  adminCookieOptions,
} from '@/lib/api/admin-auth';
import { loginAdmin, fetchAdminMe, toErrorResponse } from '@/lib/api/waterstone';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!body.email?.trim() || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const result = await loginAdmin(body.email.trim(), body.password);

    try {
      await fetchAdminMe(result.token);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            'Login succeeded but the session could not be verified. Check that the API and Firebase emulators are running.',
        },
        { status: 503 }
      );
    }

    const maxAge = Number(result.expiresIn) || 3600;

    const response = NextResponse.json({
      success: true,
      message: result.message,
      user: result.user,
    });

    // Drop any stale token first so a previous invalid session cannot win.
    response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
      ...adminCookieOptions(0),
      maxAge: 0,
    });
    response.cookies.set(
      ADMIN_TOKEN_COOKIE,
      result.token,
      adminCookieOptions(maxAge)
    );

    return response;
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
