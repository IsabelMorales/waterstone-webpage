import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import {
  deleteListing,
  updateListingRaw,
  toErrorResponse,
} from '@/lib/api/waterstone';

type RouteContext = { params: Promise<{ id: string }> };

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
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const listing = await updateListingRaw(token, id, form, contentType);
      return NextResponse.json({
        success: true,
        message: 'Listing updated.',
        listing,
      });
    }

    const json = await request.text();
    const listing = await updateListingRaw(
      token,
      id,
      json,
      'application/json'
    );
    return NextResponse.json({
      success: true,
      message: 'Listing updated.',
      listing,
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
    await deleteListing(token, id);
    return NextResponse.json({
      success: true,
      message: 'Listing deleted.',
    });
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
