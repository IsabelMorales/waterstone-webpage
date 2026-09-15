export type ListingType = 'rent' | 'sale' | 'commercial';

export type ListingStatus =
  | 'available'
  | 'pending'
  | 'rented'
  | 'sold';

export type FurnishedStatus =
  | 'furnished'
  | 'not_furnished'
  | 'offered_as_either';

/** Catalog enums from GET /api/listings/options */
export interface ListingCatalogOptions {
  types: ListingType[];
  statusesByType: Record<string, ListingStatus[]>;
  furnishedStatuses: FurnishedStatus[];
  marketAs: string[];
  defaults: {
    status: ListingStatus;
    furnishedStatus: FurnishedStatus;
    marketAs: string;
    hasConcession: boolean;
  };
}

export interface ListingOptionsResponse {
  success: boolean;
  message?: string;
  options: ListingCatalogOptions;
}

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

export interface ListingFeeItem {
  name: string;
  amount: number;
  required: boolean;
  oneTime: boolean;
  refundable: boolean;
  id?: string;
}

export interface ListingFees {
  application: ListingFeeItem;
  securityDeposit: ListingFeeItem;
  other: ListingFeeItem[];
}

export interface ListingRentInfo {
  marketAs: string;
  dateAvailable: string | null;
  shortTermAllowed: boolean;
}

export interface ListingRooms {
  legalBeds: number;
  fullBaths: number;
  halfBaths: number;
  totalRooms: number;
  totalSqft: number | null;
  unitDescription: string;
}

export interface ListingBuildingFacts {
  yearBuilt: number | null;
  buildingType: string | null;
  stories: number | null;
  period: string | null;
  buildingClass: string | null;
  unitCount: number | null;
}

export interface ToggleWithDetails {
  enabled: boolean;
  details: string | null;
}

export interface ListingBuildingAmenities {
  pets: ToggleWithDetails;
  outdoorSpace: {
    courtyard: boolean;
    roofDeck: boolean;
  };
  features: {
    concierge: boolean;
    elevator: boolean;
    laundryInBuilding: boolean;
    liveInSuper: boolean;
    smokeFree: boolean;
    wheelchairAccess: boolean;
    doorman: ToggleWithDetails;
  };
  parking: {
    garageParking: boolean;
    valetParking: boolean;
  };
  storage: {
    bikeRoom: boolean;
    coldStorage: boolean;
    lockerCage: boolean;
    packageRoom: boolean;
  };
  sharedSpaces: {
    childrenPlayroom: boolean;
    gym: boolean;
    mediaRoom: boolean;
    recreation: boolean;
    swimmingPool: boolean;
  };
}

export interface ListingUnitAmenities {
  outdoorSpace: {
    balcony: boolean;
    garden: boolean;
    privateRoofDeck: boolean;
    roofRights: boolean;
    terrace: boolean;
  };
  features: {
    centralAir: boolean;
    dishwasher: boolean;
    hardwoodFloors: boolean;
    loft: boolean;
    washerDryerInUnit: boolean;
    fireplace: ToggleWithDetails;
  };
  view: {
    city: boolean;
    garden: boolean;
    park: boolean;
    skyline: boolean;
    water: boolean;
  };
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
  hasConcession: boolean;
  furnishedStatus: FurnishedStatus;
  fees: ListingFees;
  rentInfo: ListingRentInfo;
  rooms: ListingRooms;
  buildingFacts: ListingBuildingFacts;
  buildingAmenities: ListingBuildingAmenities;
  unitAmenities: ListingUnitAmenities;
  priceHistory: ListingPriceHistoryEntry[];
  images: string[];
  videos: string[];
  floorPlans: string[];
  lat: number | null;
  lng: number | null;
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
  hasConcession?: boolean;
  furnishedStatus?: FurnishedStatus;
  fees?: ListingFees;
  rentInfo?: ListingRentInfo;
  rooms?: ListingRooms;
  buildingFacts?: ListingBuildingFacts;
  buildingAmenities?: ListingBuildingAmenities;
  unitAmenities?: ListingUnitAmenities;
  images?: string[];
  videos?: string[];
  floorPlans?: string[];
  imageMode?: 'add' | 'replace';
  removeImages?: string[];
  floorPlanMode?: 'add' | 'replace';
  removeFloorPlans?: string[];
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
