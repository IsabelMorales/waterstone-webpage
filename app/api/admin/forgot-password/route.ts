import { NextResponse } from 'next/server';
import {
  requestAdminPasswordReset,
  toErrorResponse,
} from '@/lib/api/waterstone';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };

    if (!body.email?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    const result = await requestAdminPasswordReset(body.email.trim());

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
