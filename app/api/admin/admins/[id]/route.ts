import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import {
  deleteAdmin,
  fetchAdminById,
  updateAdmin,
  toErrorResponse,
} from '@/lib/api/waterstone';
import type { AdminUpdatePayload } from '@/lib/types/admin';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const admin = await fetchAdminById(token, id);
    return NextResponse.json({ success: true, admin });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = (await request.json()) as AdminUpdatePayload;
    const admin = await updateAdmin(token, id, body);

    return NextResponse.json({
      success: true,
      message: 'Admin updated.',
      admin,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await deleteAdmin(token, id);
    return NextResponse.json({
      success: true,
      message: 'Admin deleted.',
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
