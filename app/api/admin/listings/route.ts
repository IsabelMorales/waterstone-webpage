import { NextResponse } from 'next/server';
import { getAdminToken } from '@/lib/api/admin-auth';
import {
  createListingRaw,
  fetchAdminListings,
  toErrorResponse,
} from '@/lib/api/waterstone';

export async function GET(request: Request) {
  try {
    const token = await getAdminToken();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listings = await fetchAdminListings(token, {
      type: searchParams.get('type') || undefined,
      borough: searchParams.get('borough') || undefined,
      status: searchParams.get('status') || undefined,
    });

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
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

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const listing = await createListingRaw(token, form, contentType);
      return NextResponse.json(
        { success: true, message: 'Listing created.', listing },
        { status: 201 }
      );
    }

    const json = await request.text();
    const listing = await createListingRaw(
      token,
      json,
      'application/json'
    );
    return NextResponse.json(
      { success: true, message: 'Listing created.', listing },
      { status: 201 }
    );
  } catch (err) {
    const { status, body } = toErrorResponse(err);
    return NextResponse.json(body, { status });
  }
}
