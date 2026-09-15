import type {
  FurnishedStatus,
  Listing,
  ListingBuildingAmenities,
  ListingBuildingFacts,
  ListingFeeItem,
  ListingFees,
  ListingRentInfo,
  ListingRooms,
  ListingUnitAmenities,
  ToggleWithDetails,
} from '@/lib/types/listing';

export const FURNISHED_STATUS_OPTIONS: {
  value: FurnishedStatus;
  label: string;
}[] = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'not_furnished', label: 'Not furnished' },
  { value: 'offered_as_either', label: 'Offered as either' },
];

export const FURNISHED_STATUS_LABELS: Record<FurnishedStatus, string> = {
  furnished: 'Furnished',
  not_furnished: 'Not furnished',
  offered_as_either: 'Offered as either',
};

export function defaultFeeItem(
  name: string,
  overrides?: Partial<ListingFeeItem>
): ListingFeeItem {
  return {
    name,
    amount: 0,
    required: true,
    oneTime: true,
    refundable: false,
    ...overrides,
  };
}

export function defaultFees(): ListingFees {
  return {
    application: defaultFeeItem('Application fee', {
      required: true,
      oneTime: true,
      refundable: false,
    }),
    securityDeposit: defaultFeeItem('Security deposit', {
      required: true,
      oneTime: true,
      refundable: true,
    }),
    other: [],
  };
}

export function defaultRentInfo(): ListingRentInfo {
  return {
    marketAs: 'Rental',
    dateAvailable: null,
    shortTermAllowed: false,
  };
}

export function defaultRooms(partial?: Partial<ListingRooms>): ListingRooms {
  return {
    legalBeds: 0,
    fullBaths: 0,
    halfBaths: 0,
    totalRooms: 0,
    totalSqft: null,
    unitDescription: '',
    ...partial,
  };
}

export function defaultBuildingFacts(): ListingBuildingFacts {
  return {
    yearBuilt: null,
    buildingType: null,
    stories: null,
    period: null,
    buildingClass: null,
    unitCount: null,
  };
}

export function defaultToggle(
  overrides?: Partial<ToggleWithDetails>
): ToggleWithDetails {
  return { enabled: false, details: null, ...overrides };
}

export function defaultBuildingAmenities(): ListingBuildingAmenities {
  return {
    pets: defaultToggle(),
    outdoorSpace: { courtyard: false, roofDeck: false },
    features: {
      concierge: false,
      elevator: false,
      laundryInBuilding: false,
      liveInSuper: false,
      smokeFree: false,
      wheelchairAccess: false,
      doorman: defaultToggle(),
    },
    parking: { garageParking: false, valetParking: false },
    storage: {
      bikeRoom: false,
      coldStorage: false,
      lockerCage: false,
      packageRoom: false,
    },
    sharedSpaces: {
      childrenPlayroom: false,
      gym: false,
      mediaRoom: false,
      recreation: false,
      swimmingPool: false,
    },
  };
}

export function defaultUnitAmenities(): ListingUnitAmenities {
  return {
    outdoorSpace: {
      balcony: false,
      garden: false,
      privateRoofDeck: false,
      roofRights: false,
      terrace: false,
    },
    features: {
      centralAir: false,
      dishwasher: false,
      hardwoodFloors: false,
      loft: false,
      washerDryerInUnit: false,
      fireplace: defaultToggle(),
    },
    view: {
      city: false,
      garden: false,
      park: false,
      skyline: false,
      water: false,
    },
  };
}

/** Human labels for amenity keys (StreetEasy-style). */
export const BUILDING_AMENITY_LABELS: Record<string, string> = {
  pets: 'Pets allowed',
  courtyard: 'Courtyard',
  roofDeck: 'Roof deck',
  concierge: 'Concierge',
  elevator: 'Elevator',
  laundryInBuilding: 'Laundry in building',
  liveInSuper: 'Live-in super',
  smokeFree: 'Smoke-free',
  wheelchairAccess: 'Wheelchair access',
  doorman: 'Doorman',
  garageParking: 'Garage parking',
  valetParking: 'Valet parking',
  bikeRoom: 'Bike room',
  coldStorage: 'Cold storage',
  lockerCage: 'Locker/cage',
  packageRoom: 'Package room',
  childrenPlayroom: "Children's playroom",
  gym: 'Gym',
  mediaRoom: 'Media room',
  recreation: 'Recreation',
  swimmingPool: 'Swimming pool',
};

export const UNIT_AMENITY_LABELS: Record<string, string> = {
  balcony: 'Balcony',
  garden: 'Garden',
  privateRoofDeck: 'Private roof deck',
  roofRights: 'Roof rights',
  terrace: 'Terrace',
  centralAir: 'Central air',
  dishwasher: 'Dishwasher',
  hardwoodFloors: 'Hardwood floors',
  loft: 'Loft',
  washerDryerInUnit: 'Washer/dryer in unit',
  fireplace: 'Fireplace',
  city: 'City',
  park: 'Park',
  skyline: 'Skyline',
  water: 'Water',
};

export function mergeFees(input?: ListingFees | null): ListingFees {
  const base = defaultFees();
  if (!input) return base;
  return {
    application: { ...base.application, ...input.application },
    securityDeposit: { ...base.securityDeposit, ...input.securityDeposit },
    other: Array.isArray(input.other) ? input.other : [],
  };
}

export function mergeBuildingAmenities(
  input?: ListingBuildingAmenities | null
): ListingBuildingAmenities {
  const d = defaultBuildingAmenities();
  if (!input) return d;
  return {
    pets: { ...d.pets, ...input.pets },
    outdoorSpace: { ...d.outdoorSpace, ...input.outdoorSpace },
    features: {
      ...d.features,
      ...input.features,
      doorman: { ...d.features.doorman, ...input.features?.doorman },
    },
    parking: { ...d.parking, ...input.parking },
    storage: { ...d.storage, ...input.storage },
    sharedSpaces: { ...d.sharedSpaces, ...input.sharedSpaces },
  };
}

export function mergeUnitAmenities(
  input?: ListingUnitAmenities | null
): ListingUnitAmenities {
  const d = defaultUnitAmenities();
  if (!input) return d;
  return {
    outdoorSpace: { ...d.outdoorSpace, ...input.outdoorSpace },
    features: {
      ...d.features,
      ...input.features,
      fireplace: { ...d.features.fireplace, ...input.features?.fireplace },
    },
    view: { ...d.view, ...input.view },
  };
}

export function roomsFromListing(listing?: Listing | null): ListingRooms {
  if (!listing) return defaultRooms();
  if (listing.rooms) {
    return defaultRooms({
      ...listing.rooms,
      legalBeds: listing.rooms.legalBeds ?? listing.bedrooms ?? 0,
      totalSqft: listing.rooms.totalSqft ?? listing.sqft ?? null,
      unitDescription:
        listing.rooms.unitDescription || listing.description || '',
    });
  }
  return defaultRooms({
    legalBeds: listing.bedrooms || 0,
    fullBaths: Math.floor(listing.bathrooms || 0),
    halfBaths: (listing.bathrooms || 0) % 1 >= 0.5 ? 1 : 0,
    totalSqft: listing.sqft,
    unitDescription: listing.description || '',
  });
}
