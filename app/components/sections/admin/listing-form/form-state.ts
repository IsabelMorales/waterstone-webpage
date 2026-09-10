import type {
  FurnishedStatus,
  Listing,
  ListingBuildingAmenities,
  ListingBuildingFacts,
  ListingFees,
  ListingRentInfo,
  ListingRooms,
  ListingStatus,
  ListingType,
  ListingUnitAmenities,
} from '@/lib/types/listing';
import {
  defaultBuildingFacts,
  defaultRentInfo,
  mergeBuildingAmenities,
  mergeFees,
  mergeUnitAmenities,
  roomsFromListing,
} from '@/lib/listing-defaults';
import { toIsoDateValue, toUsDateDisplay } from '@/lib/listings-format';

export type ListingFormTabId =
  | 'basics'
  | 'building'
  | 'unit'
  | 'costs'
  | 'media';

export const LISTING_FORM_TABS: { id: ListingFormTabId; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'building', label: 'Building' },
  { id: 'unit', label: 'Unit' },
  { id: 'costs', label: 'Costs & Fees' },
  { id: 'media', label: 'Photos & media' },
];

export interface ListingFormState {
  type: ListingType;
  title: string;
  address: string;
  borough: string;
  neighborhood: string;
  price: string;
  description: string;
  status: ListingStatus;
  hasConcession: boolean;
  furnishedStatus: FurnishedStatus;
  fees: ListingFees;
  rentInfo: ListingRentInfo;
  rooms: ListingRooms;
  buildingFacts: ListingBuildingFacts;
  buildingAmenities: ListingBuildingAmenities;
  unitAmenities: ListingUnitAmenities;
  videos: string[];
}

export function statusesForType(type: ListingType): ListingStatus[] {
  return type === 'rent'
    ? ['available', 'pending', 'rented']
    : ['available', 'pending', 'sold'];
}

export function toFormState(listing?: Listing): ListingFormState {
  const rooms = roomsFromListing(listing);
  return {
    type: listing?.type || 'rent',
    title: listing?.title || '',
    address: listing?.address || '',
    borough: listing?.borough || '',
    neighborhood: listing?.neighborhood || '',
    price: listing?.price != null ? String(listing.price) : '',
    description: listing?.description || rooms.unitDescription || '',
    status: listing?.status || 'available',
    hasConcession: Boolean(listing?.hasConcession),
    furnishedStatus: listing?.furnishedStatus || 'not_furnished',
    fees: mergeFees(listing?.fees),
    rentInfo: {
      ...defaultRentInfo(),
      ...listing?.rentInfo,
      dateAvailable: toUsDateDisplay(listing?.rentInfo?.dateAvailable) || null,
    },
    rooms,
    buildingFacts: {
      ...defaultBuildingFacts(),
      ...listing?.buildingFacts,
    },
    buildingAmenities: mergeBuildingAmenities(listing?.buildingAmenities),
    unitAmenities: mergeUnitAmenities(listing?.unitAmenities),
    videos: listing?.videos?.length ? [...listing.videos] : [''],
  };
}

export function buildWritePayload(fields: ListingFormState) {
  const videos = fields.videos
    .map((v) => v.trim())
    .filter(Boolean);

  const bathrooms =
    Number(fields.rooms.fullBaths || 0) +
    Number(fields.rooms.halfBaths || 0) * 0.5;

  return {
    type: fields.type,
    title: fields.title.trim(),
    address: fields.address.trim(),
    borough: fields.borough.trim(),
    neighborhood: fields.neighborhood.trim() || null,
    price: Number(fields.price) || 0,
    bedrooms: Number(fields.rooms.legalBeds) || 0,
    bathrooms,
    sqft:
      fields.rooms.totalSqft != null && String(fields.rooms.totalSqft) !== ''
        ? Number(fields.rooms.totalSqft)
        : null,
    description:
      fields.rooms.unitDescription?.trim() || fields.description.trim(),
    status: fields.status,
    hasConcession: fields.hasConcession,
    furnishedStatus: fields.furnishedStatus,
    fees: {
      ...fields.fees,
      other: fields.fees.other.filter((fee) => fee.name.trim()),
    },
    rentInfo: {
      ...fields.rentInfo,
      dateAvailable: toIsoDateValue(fields.rentInfo.dateAvailable),
      marketAs: fields.rentInfo.marketAs.trim() || 'Rental Unit',
    },
    rooms: {
      ...fields.rooms,
      legalBeds: Number(fields.rooms.legalBeds) || 0,
      fullBaths: Number(fields.rooms.fullBaths) || 0,
      halfBaths: Number(fields.rooms.halfBaths) || 0,
      totalRooms: Number(fields.rooms.totalRooms) || 0,
      totalSqft:
        fields.rooms.totalSqft != null && String(fields.rooms.totalSqft) !== ''
          ? Number(fields.rooms.totalSqft)
          : null,
      unitDescription: fields.rooms.unitDescription || '',
    },
    buildingFacts: {
      yearBuilt: toNullableNumber(fields.buildingFacts.yearBuilt),
      stories: toNullableNumber(fields.buildingFacts.stories),
      unitCount: toNullableNumber(fields.buildingFacts.unitCount),
      buildingType: emptyToNull(fields.buildingFacts.buildingType),
      period: emptyToNull(fields.buildingFacts.period),
      buildingClass: emptyToNull(fields.buildingFacts.buildingClass),
    },
    buildingAmenities: fields.buildingAmenities,
    unitAmenities: fields.unitAmenities,
    videos,
  };
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

function toNullableNumber(value: number | null | undefined): number | null {
  if (value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
