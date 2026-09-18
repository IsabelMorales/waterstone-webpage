import type {
  Listing,
  ListingOptionsResponse,
  ListingResponse,
  ListingsListResponse,
  LoginResponse,
  AuthUser,
  ListingCatalogOptions,
} from '@/lib/types/listing';
import type {
  AdminUser,
  AdminCreatePayload,
  AdminUpdatePayload,
  AdminsListResponse,
  AdminResponse,
} from '@/lib/types/admin';

export type { AdminUser, AdminCreatePayload, AdminUpdatePayload };

const API_BASE = process.env.WATERSTONE_API_BASE_URL?.replace(/\/$/, '') || '';
const CLIENT_TOKEN = process.env.WATERSTONE_CLIENT_API_TOKEN || '';

export class WaterstoneApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'WaterstoneApiError';
    this.status = status;
  }
}

function assertConfig() {
  if (!API_BASE || !CLIENT_TOKEN) {
    throw new WaterstoneApiError(
      'Waterstone API is not configured. Set WATERSTONE_API_BASE_URL and WATERSTONE_CLIENT_API_TOKEN.',
      500
    );
  }
}

export function getApiBaseUrl(): string {
  assertConfig();
  return API_BASE;
}

export function getClientToken(): string {
  assertConfig();
  return CLIENT_TOKEN;
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!response.ok) {
    throw new WaterstoneApiError(
      data.message || 'Request to Waterstone API failed.',
      response.status
    );
  }

  return data;
}

function clientHeaders(extra?: HeadersInit): HeadersInit {
  return {
    'X-Client-Token': CLIENT_TOKEN,
    ...extra,
  };
}

function adminHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    ...extra,
  };
}

export type ListingQuery = {
  type?: string;
  borough?: string;
  status?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  bedrooms?: string | number;
  ownerId?: string;
};

function toQueryString(query?: ListingQuery): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchListings(query?: ListingQuery): Promise<Listing[]> {
  assertConfig();
  const response = await fetch(
    `${API_BASE}/api/listings${toQueryString(query)}`,
    {
      headers: clientHeaders(),
      cache: 'no-store',
    }
  );
  const data = await parseJson<ListingsListResponse>(response);
  return data.listings;
}

export async function fetchListingOptions(): Promise<ListingCatalogOptions> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/listings/options`, {
    headers: clientHeaders(),
    cache: 'no-store',
  });
  const data = await parseJson<ListingOptionsResponse>(response);
  return data.options;
}

export async function fetchListingBySlug(slug: string): Promise<Listing> {
  assertConfig();
  const response = await fetch(
    `${API_BASE}/api/listings/by-slug/${encodeURIComponent(slug)}`,
    {
      headers: clientHeaders(),
      cache: 'no-store',
    }
  );
  const data = await parseJson<ListingResponse>(response);
  return data.listing;
}

export async function fetchListingById(id: string): Promise<Listing> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    headers: clientHeaders(),
    cache: 'no-store',
  });
  const data = await parseJson<ListingResponse>(response);
  return data.listing;
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: clientHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });
  return parseJson<LoginResponse>(response);
}

export async function requestAdminPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: clientHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email }),
    cache: 'no-store',
  });
  return parseJson<{ success: boolean; message: string }>(response);
}

export async function fetchAdminMe(token: string): Promise<AuthUser> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    headers: adminHeaders(token),
    cache: 'no-store',
  });
  const data = await parseJson<{ user: AuthUser }>(response);
  return data.user;
}

export async function fetchAdminListings(
  token: string,
  query?: ListingQuery
): Promise<Listing[]> {
  assertConfig();
  // Catalog GET uses client token; admin panel reuses it after session check.
  const response = await fetch(
    `${API_BASE}/api/listings${toQueryString(query)}`,
    {
      headers: clientHeaders(),
      cache: 'no-store',
    }
  );
  const data = await parseJson<ListingsListResponse>(response);
  void token;
  return data.listings;
}

export async function createListingRaw(
  token: string,
  body: BodyInit,
  contentType?: string | null
): Promise<Listing> {
  assertConfig();
  const headers: HeadersInit = adminHeaders(token);
  if (contentType && !contentType.includes('multipart/form-data')) {
    (headers as Record<string, string>)['Content-Type'] = contentType;
  }
  const response = await fetch(`${API_BASE}/api/listings`, {
    method: 'POST',
    headers,
    body,
    cache: 'no-store',
  });
  const data = await parseJson<ListingResponse>(response);
  return data.listing;
}

export async function updateListingRaw(
  token: string,
  id: string,
  body: BodyInit,
  contentType?: string | null
): Promise<Listing> {
  assertConfig();
  const headers: HeadersInit = adminHeaders(token);
  if (contentType && !contentType.includes('multipart/form-data')) {
    (headers as Record<string, string>)['Content-Type'] = contentType;
  }
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: 'PUT',
    headers,
    body,
    cache: 'no-store',
  });
  const data = await parseJson<ListingResponse>(response);
  return data.listing;
}

export async function deleteListing(token: string, id: string): Promise<void> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(token),
    cache: 'no-store',
  });
  await parseJson<{ success: boolean }>(response);
}

export async function reorderListings(
  token: string,
  orderedIds: string[]
): Promise<Listing[]> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/listings/reorder`, {
    method: 'PUT',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ orderedIds }),
    cache: 'no-store',
  });
  const data = await parseJson<ListingsListResponse>(response);
  return data.listings;
}

export function toErrorResponse(err: unknown) {
  if (err instanceof WaterstoneApiError) {
    return {
      status: err.status,
      body: { success: false, message: err.message },
    };
  }
  return {
    status: 500,
    body: {
      success: false,
      message: err instanceof Error ? err.message : 'Unexpected server error.',
    },
  };
}

export async function fetchAdmins(token: string): Promise<AdminUser[]> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/admins`, {
    headers: adminHeaders(token),
    cache: 'no-store',
  });
  const data = await parseJson<AdminsListResponse>(response);
  return data.admins;
}

export async function fetchAdminById(
  token: string,
  id: string
): Promise<AdminUser> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/admins/${encodeURIComponent(id)}`, {
    headers: adminHeaders(token),
    cache: 'no-store',
  });
  const data = await parseJson<AdminResponse>(response);
  return data.admin;
}

export async function createAdmin(
  token: string,
  payload: AdminCreatePayload
): Promise<AdminUser> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/admins`, {
    method: 'POST',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await parseJson<AdminResponse>(response);
  return data.admin;
}

export async function updateAdmin(
  token: string,
  id: string,
  payload: AdminUpdatePayload
): Promise<AdminUser> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/admins/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  const data = await parseJson<AdminResponse>(response);
  return data.admin;
}

export async function deleteAdmin(token: string, id: string): Promise<void> {
  assertConfig();
  const response = await fetch(`${API_BASE}/api/admins/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: adminHeaders(token),
    cache: 'no-store',
  });
  await parseJson<{ success: boolean }>(response);
}
