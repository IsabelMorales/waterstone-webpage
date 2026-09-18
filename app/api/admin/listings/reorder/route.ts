import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import { reorderListings, toErrorResponse } from '@/lib/api/waterstone';

export async function PUT(request: Request) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { orderedIds?: string[] };
    const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds : [];

    if (!orderedIds.length) {
      return NextResponse.json(
        { success: false, message: 'orderedIds must be a non-empty array.' },
        { status: 400 }
      );
    }

    const listings = await reorderListings(token, orderedIds);

    return NextResponse.json({
      success: true,
      message: 'Listing order updated.',
      count: listings.length,
      listings,
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
