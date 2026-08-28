export type ListingType = 'rent' | 'sale';

export type ListingStatus =
  | 'available'
  | 'pending'
  | 'rented'
  | 'sold';

export interface ListingHomeFeature {
  label: string;
  sublabel?: string;
}

export interface ListingAmenityGroup {
  category: string;
  items: { label: string; sublabel?: string }[];
}

export interface ListingCustomField {
  label: string;
  value: string;
}

export interface ListingPriceHistoryEntry {
  date: string;
  amount: number;
  type: ListingType;
  event: string;
}

export interface Listing {
  id: string;
  slug: string;
  ownerId: string;
  type: ListingType;
  title: string;
  address: string;
  borough: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  description: string;
  amenities: string[];
  homeFeatures: ListingHomeFeature[];
  amenityGroups: ListingAmenityGroup[];
  policies: string[];
  customFields: ListingCustomField[];
  unitDetails: Record<string, unknown> | null;
  building: Record<string, unknown> | null;
  priceHistory: ListingPriceHistoryEntry[];
  images: string[];
  videos: string[];
  floorPlans: string[];
  lat: number;
  lng: number;
  status: ListingStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ListingWritePayload {
  type: ListingType;
  title: string;
  address: string;
  borough: string;
  neighborhood?: string | null;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number | null;
  description?: string;
  status?: ListingStatus;
  amenities?: string[];
  homeFeatures?: ListingHomeFeature[];
  amenityGroups?: ListingAmenityGroup[];
  policies?: string[];
  customFields?: ListingCustomField[];
  unitDetails?: Record<string, unknown> | null;
  building?: Record<string, unknown> | null;
  images?: string[];
  videos?: string[];
  floorPlans?: string[];
  imageMode?: 'add' | 'replace';
  removeImages?: string[];
}

export interface ListingsListResponse {
  success: boolean;
  message: string;
  count: number;
  listings: Listing[];
}

export interface ListingResponse {
  success: boolean;
  message: string;
  listing: Listing;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  token: string;
  refreshToken?: string;
  expiresIn?: string;
}
