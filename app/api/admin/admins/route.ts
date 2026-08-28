import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import {
  createAdmin,
  fetchAdmins,
  toErrorResponse,
} from '@/lib/api/waterstone';
import type { AdminCreatePayload } from '@/lib/types/admin';

export async function GET() {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const admins = await fetchAdmins(token);
    return NextResponse.json({
      success: true,
      count: admins.length,
      admins,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as AdminCreatePayload;
    if (!body.email?.trim() || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const admin = await createAdmin(token, {
      email: body.email.trim(),
      password: body.password,
      displayName: body.displayName?.trim() || undefined,
    });

    return NextResponse.json(
      { success: true, message: 'Admin created.', admin },
      { status: 201 }
    );
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
