'use client';

import type { ListingRentInfo, ListingRooms, ListingUnitAmenities } from '@/lib/types/listing';
import { UNIT_AMENITY_LABELS } from '@/lib/listing-defaults';
import { toIsoDateValue, toUsDateDisplay } from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import {
  adminInputClassName,
  adminLabelClassName,
  adminNumberClassName,
  adminSectionTitleClassName,
} from '../admin-ui';
import { AmenityCheckbox, AmenityGroup } from './AmenityControls';
import type { ListingFormState } from './form-state';

interface UnitTabProps {
  fields: ListingFormState;
  onRentInfoChange: (rentInfo: ListingRentInfo) => void;
  onRoomsChange: (rooms: ListingRooms) => void;
  onAmenitiesChange: (amenities: ListingUnitAmenities) => void;
}

function numValue(value: number | null | undefined): string {
  return value == null ? '' : String(value);
}

export default function UnitTab({
  fields,
  onRentInfoChange,
  onRoomsChange,
  onAmenitiesChange,
}: UnitTabProps) {
  const { rentInfo, rooms, unitAmenities } = fields;

  function setRoom<K extends keyof ListingRooms>(
    key: K,
    value: ListingRooms[K]
  ) {
    onRoomsChange({ ...rooms, [key]: value });
  }

  function setAmenity(path: (a: ListingUnitAmenities) => void) {
    const next = structuredClone(unitAmenities);
    path(next);
    onAmenitiesChange(next);
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className={adminSectionTitleClassName}>Rent information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <label htmlFor="rent-market-as" className={adminLabelClassName}>
              Market as
            </label>
            <input
              id="rent-market-as"
              value={rentInfo.marketAs}
              onChange={(e) =>
                onRentInfoChange({ ...rentInfo, marketAs: e.target.value })
              }
              className={adminInputClassName}
              placeholder="Rental Unit"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="rent-date" className={adminLabelClassName}>
                Date available
              </label>
              <input
                id="rent-date"
                type="date"
                value={toIsoDateValue(rentInfo.dateAvailable) || ''}
                onChange={(e) =>
                  onRentInfoChange({
                    ...rentInfo,
                    dateAvailable: e.target.value
                      ? toUsDateDisplay(e.target.value)
                      : null,
                  })
                }
                onKeyDown={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                onClick={(e) => {
                  const input = e.currentTarget;
                  if (typeof input.showPicker === 'function') {
                    try {
                      input.showPicker();
                    } catch {
                      // Browser may reject showPicker if not triggered by user gesture edge cases
                    }
                  }
                }}
                className={cn(
                  adminInputClassName,
                  '[color-scheme:dark] cursor-pointer caret-transparent'
                )}
              />
            </div>
            <AmenityCheckbox
              id="rent-short-term"
              label="Short term allowed"
              checked={rentInfo.shortTermAllowed}
              onChange={(checked) =>
                onRentInfoChange({ ...rentInfo, shortTermAllowed: checked })
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className={adminSectionTitleClassName}>Rooms and description</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          <div>
            <label htmlFor="rooms-beds" className={adminLabelClassName}>
              Legal beds
            </label>
            <input
              id="rooms-beds"
              type="number"
              min="0"
              inputMode="numeric"
              value={numValue(rooms.legalBeds)}
              onChange={(e) =>
                setRoom('legalBeds', Number(e.target.value) || 0)
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="rooms-full-baths" className={adminLabelClassName}>
              Full baths
            </label>
            <input
              id="rooms-full-baths"
              type="number"
              min="0"
              inputMode="numeric"
              value={numValue(rooms.fullBaths)}
              onChange={(e) =>
                setRoom('fullBaths', Number(e.target.value) || 0)
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="rooms-half-baths" className={adminLabelClassName}>
              Half baths
            </label>
            <input
              id="rooms-half-baths"
              type="number"
              min="0"
              inputMode="numeric"
              value={numValue(rooms.halfBaths)}
              onChange={(e) =>
                setRoom('halfBaths', Number(e.target.value) || 0)
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="rooms-total" className={adminLabelClassName}>
              Total rooms
            </label>
            <input
              id="rooms-total"
              type="number"
              min="0"
              inputMode="numeric"
              value={numValue(rooms.totalRooms)}
              onChange={(e) =>
                setRoom('totalRooms', Number(e.target.value) || 0)
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="rooms-sqft" className={adminLabelClassName}>
              Total square feet
            </label>
            <input
              id="rooms-sqft"
              type="number"
              min="0"
              inputMode="numeric"
              value={numValue(rooms.totalSqft)}
              onChange={(e) =>
                setRoom(
                  'totalSqft',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              className={adminNumberClassName}
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="rooms-desc" className={adminLabelClassName}>
            Unit description
          </label>
          <textarea
            id="rooms-desc"
            rows={5}
            value={rooms.unitDescription}
            onChange={(e) => setRoom('unitDescription', e.target.value)}
            className={cn(adminInputClassName, 'resize-y min-h-[8rem]')}
            placeholder="Enter your description"
          />
        </div>
      </section>

      <section className="space-y-8">
        <h2 className={adminSectionTitleClassName}>Unit amenities</h2>

        <AmenityGroup title="Outdoor space">
          {(
            [
              'balcony',
              'garden',
              'privateRoofDeck',
              'roofRights',
              'terrace',
            ] as const
          ).map((key) => (
            <AmenityCheckbox
              key={key}
              id={`ua-out-${key}`}
              label={UNIT_AMENITY_LABELS[key]}
              checked={unitAmenities.outdoorSpace[key]}
              onChange={(checked) =>
                setAmenity((a) => {
                  a.outdoorSpace[key] = checked;
                })
              }
            />
          ))}
        </AmenityGroup>

        <AmenityGroup title="Features">
          {(
            [
              'centralAir',
              'dishwasher',
              'hardwoodFloors',
              'loft',
              'washerDryerInUnit',
            ] as const
          ).map((key) => (
            <AmenityCheckbox
              key={key}
              id={`ua-feat-${key}`}
              label={UNIT_AMENITY_LABELS[key]}
              checked={unitAmenities.features[key]}
              onChange={(checked) =>
                setAmenity((a) => {
                  a.features[key] = checked;
                })
              }
            />
          ))}
          <div className="sm:col-span-2 space-y-3">
            <AmenityCheckbox
              id="ua-fireplace"
              label={UNIT_AMENITY_LABELS.fireplace}
              checked={unitAmenities.features.fireplace.enabled}
              onChange={(checked) =>
                setAmenity((a) => {
                  a.features.fireplace.enabled = checked;
                  if (!checked) a.features.fireplace.details = null;
                })
              }
            />
            {unitAmenities.features.fireplace.enabled && (
              <input
                value={unitAmenities.features.fireplace.details || ''}
                onChange={(e) =>
                  setAmenity((a) => {
                    a.features.fireplace.details = e.target.value || null;
                  })
                }
                className={adminInputClassName}
                placeholder="Fireplace details"
              />
            )}
          </div>
        </AmenityGroup>

        <AmenityGroup title="View">
          {(['city', 'garden', 'park', 'skyline', 'water'] as const).map(
            (key) => (
              <AmenityCheckbox
                key={key}
                id={`ua-view-${key}`}
                label={UNIT_AMENITY_LABELS[key]}
                checked={unitAmenities.view[key]}
                onChange={(checked) =>
                  setAmenity((a) => {
                    a.view[key] = checked;
                  })
                }
              />
            )
          )}
        </AmenityGroup>
      </section>
    </div>
  );
}
