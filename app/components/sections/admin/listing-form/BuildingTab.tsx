'use client';

import type { ListingBuildingAmenities, ListingBuildingFacts } from '@/lib/types/listing';
import { BUILDING_AMENITY_LABELS } from '@/lib/listing-defaults';
import {
  adminInputClassName,
  adminLabelClassName,
  adminNumberClassName,
  adminSectionTitleClassName,
} from '../admin-ui';
import { AmenityCheckbox, AmenityGroup } from './AmenityControls';
import type { ListingFormState } from './form-state';

interface BuildingTabProps {
  fields: ListingFormState;
  onFactsChange: (facts: ListingBuildingFacts) => void;
  onAmenitiesChange: (amenities: ListingBuildingAmenities) => void;
}

function factValue(value: number | null): string {
  return value == null ? '' : String(value);
}

export default function BuildingTab({
  fields,
  onFactsChange,
  onAmenitiesChange,
}: BuildingTabProps) {
  const facts = fields.buildingFacts;
  const amenities = fields.buildingAmenities;

  function setFact<K extends keyof ListingBuildingFacts>(
    key: K,
    value: ListingBuildingFacts[K]
  ) {
    onFactsChange({ ...facts, [key]: value });
  }

  function setBool(
    path: (a: ListingBuildingAmenities) => void
  ) {
    const next = structuredClone(amenities);
    path(next);
    onAmenitiesChange(next);
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className={adminSectionTitleClassName}>Building facts</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="bf-year" className={adminLabelClassName}>
              Year built
            </label>
            <input
              id="bf-year"
              type="number"
              min="1700"
              max="2100"
              inputMode="numeric"
              value={factValue(facts.yearBuilt)}
              onChange={(e) =>
                setFact(
                  'yearBuilt',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="bf-period" className={adminLabelClassName}>
              Period
            </label>
            <input
              id="bf-period"
              value={facts.period || ''}
              onChange={(e) => setFact('period', e.target.value || null)}
              className={adminInputClassName}
              placeholder="Pre-war, Post-war…"
            />
          </div>
          <div>
            <label htmlFor="bf-type" className={adminLabelClassName}>
              Building type
            </label>
            <input
              id="bf-type"
              value={facts.buildingType || ''}
              onChange={(e) =>
                setFact('buildingType', e.target.value || null)
              }
              className={adminInputClassName}
              placeholder="Elevator, Rental…"
            />
          </div>
          <div>
            <label htmlFor="bf-class" className={adminLabelClassName}>
              Building class
            </label>
            <input
              id="bf-class"
              value={facts.buildingClass || ''}
              onChange={(e) =>
                setFact('buildingClass', e.target.value || null)
              }
              className={adminInputClassName}
              placeholder="C1, D6…"
            />
          </div>
          <div>
            <label htmlFor="bf-stories" className={adminLabelClassName}>
              Stories
            </label>
            <input
              id="bf-stories"
              type="number"
              min="0"
              inputMode="numeric"
              value={factValue(facts.stories)}
              onChange={(e) =>
                setFact(
                  'stories',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              className={adminNumberClassName}
            />
          </div>
          <div>
            <label htmlFor="bf-units" className={adminLabelClassName}>
              Unit count
            </label>
            <input
              id="bf-units"
              type="number"
              min="0"
              inputMode="numeric"
              value={factValue(facts.unitCount)}
              onChange={(e) =>
                setFact(
                  'unitCount',
                  e.target.value === '' ? null : Number(e.target.value)
                )
              }
              className={adminNumberClassName}
            />
          </div>
        </div>
      </section>

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
