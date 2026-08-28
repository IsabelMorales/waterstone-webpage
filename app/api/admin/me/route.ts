import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import { fetchAdminMe, toErrorResponse } from '@/lib/api/waterstone';

export async function GET() {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const user = await fetchAdminMe(token);
    return NextResponse.json({ success: true, user });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
