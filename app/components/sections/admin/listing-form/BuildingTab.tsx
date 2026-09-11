'use client';

import type { ListingBuildingAmenities } from '@/lib/types/listing';
import { BUILDING_AMENITY_LABELS } from '@/lib/listing-defaults';
import {
  adminInputClassName,
  adminSectionTitleClassName,
} from '../admin-ui';
import { AmenityCheckbox, AmenityGroup } from './AmenityControls';
import type { ListingFormState } from './form-state';

interface BuildingTabProps {
  fields: ListingFormState;
  onAmenitiesChange: (amenities: ListingBuildingAmenities) => void;
}

export default function BuildingTab({
  fields,
  onAmenitiesChange,
}: BuildingTabProps) {
  const amenities = fields.buildingAmenities;

  function setBool(path: (a: ListingBuildingAmenities) => void) {
    const next = structuredClone(amenities);
    path(next);
    onAmenitiesChange(next);
  }

  return (
    <div className="space-y-10">
      <section className="space-y-8">
        <h2 className={adminSectionTitleClassName}>Building amenities</h2>

        <AmenityGroup title="Pet policy">
          <div className="sm:col-span-2 space-y-3">
            <AmenityCheckbox
              id="ba-pets"
              label={BUILDING_AMENITY_LABELS.pets}
              checked={amenities.pets.enabled}
              onChange={(checked) =>
                setBool((a) => {
                  a.pets.enabled = checked;
                  if (!checked) a.pets.details = null;
                })
              }
            />
            {amenities.pets.enabled && (
              <input
                value={amenities.pets.details || ''}
                onChange={(e) =>
                  setBool((a) => {
                    a.pets.details = e.target.value || null;
                  })
                }
                className={adminInputClassName}
                placeholder="e.g. Cats and dogs under 40lbs"
              />
            )}
          </div>
        </AmenityGroup>

        <AmenityGroup title="Outdoor space">
          <AmenityCheckbox
            id="ba-courtyard"
            label={BUILDING_AMENITY_LABELS.courtyard}
            checked={amenities.outdoorSpace.courtyard}
            onChange={(checked) =>
              setBool((a) => {
                a.outdoorSpace.courtyard = checked;
              })
            }
          />
          <AmenityCheckbox
            id="ba-roof-deck"
            label={BUILDING_AMENITY_LABELS.roofDeck}
            checked={amenities.outdoorSpace.roofDeck}
            onChange={(checked) =>
              setBool((a) => {
                a.outdoorSpace.roofDeck = checked;
              })
            }
          />
        </AmenityGroup>

        <AmenityGroup title="Features">
          {(
            [
              ['concierge', 'concierge'],
              ['elevator', 'elevator'],
              ['laundryInBuilding', 'laundryInBuilding'],
              ['liveInSuper', 'liveInSuper'],
              ['smokeFree', 'smokeFree'],
              ['wheelchairAccess', 'wheelchairAccess'],
            ] as const
          ).map(([key, labelKey]) => (
            <AmenityCheckbox
              key={key}
              id={`ba-${key}`}
              label={BUILDING_AMENITY_LABELS[labelKey]}
              checked={amenities.features[key]}
              onChange={(checked) =>
                setBool((a) => {
                  a.features[key] = checked;
                })
              }
            />
          ))}
          <div className="sm:col-span-2 space-y-3">
            <AmenityCheckbox
              id="ba-doorman"
              label={BUILDING_AMENITY_LABELS.doorman}
              checked={amenities.features.doorman.enabled}
              onChange={(checked) =>
                setBool((a) => {
                  a.features.doorman.enabled = checked;
                  if (!checked) a.features.doorman.details = null;
                })
              }
            />
            {amenities.features.doorman.enabled && (
              <input
                value={amenities.features.doorman.details || ''}
                onChange={(e) =>
                  setBool((a) => {
                    a.features.doorman.details = e.target.value || null;
                  })
                }
                className={adminInputClassName}
                placeholder="e.g. Part-time, Full-time"
              />
            )}
          </div>
        </AmenityGroup>

        <AmenityGroup title="Parking">
          <AmenityCheckbox
            id="ba-garage"
            label={BUILDING_AMENITY_LABELS.garageParking}
            checked={amenities.parking.garageParking}
            onChange={(checked) =>
              setBool((a) => {
                a.parking.garageParking = checked;
              })
            }
          />
          <AmenityCheckbox
            id="ba-valet"
            label={BUILDING_AMENITY_LABELS.valetParking}
            checked={amenities.parking.valetParking}
            onChange={(checked) =>
              setBool((a) => {
                a.parking.valetParking = checked;
              })
            }
          />
        </AmenityGroup>

        <AmenityGroup title="Storage">
          {(
            [
              ['bikeRoom', 'bikeRoom'],
              ['coldStorage', 'coldStorage'],
              ['lockerCage', 'lockerCage'],
              ['packageRoom', 'packageRoom'],
            ] as const
          ).map(([key, labelKey]) => (
            <AmenityCheckbox
              key={key}
              id={`ba-${key}`}
              label={BUILDING_AMENITY_LABELS[labelKey]}
              checked={amenities.storage[key]}
              onChange={(checked) =>
                setBool((a) => {
                  a.storage[key] = checked;
                })
              }
            />
          ))}
        </AmenityGroup>

        <AmenityGroup title="Shared spaces">
          {(
            [
              ['childrenPlayroom', 'childrenPlayroom'],
              ['gym', 'gym'],
              ['mediaRoom', 'mediaRoom'],
              ['recreation', 'recreation'],
              ['swimmingPool', 'swimmingPool'],
            ] as const
          ).map(([key, labelKey]) => (
            <AmenityCheckbox
              key={key}
              id={`ba-${key}`}
              label={BUILDING_AMENITY_LABELS[labelKey]}
              checked={amenities.sharedSpaces[key]}
              onChange={(checked) =>
                setBool((a) => {
                  a.sharedSpaces[key] = checked;
                })
              }
            />
          ))}
        </AmenityGroup>
      </section>
    </div>
  );
}
