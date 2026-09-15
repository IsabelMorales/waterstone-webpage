'use client';

import type {
  ListingCatalogOptions,
  ListingStatus,
  ListingType,
} from '@/lib/types/listing';
import {
  FALLBACK_LISTING_OPTIONS,
  listingStatusLabel,
  listingTypeLabel,
  statusesForType,
} from '@/lib/listing-options';
import SelectChevron from '../SelectChevron';
import {
  adminInputClassName,
  adminLabelClassName,
  adminSectionTitleClassName,
  adminSelectClassName,
} from '../admin-ui';
import type { ListingFormState } from './form-state';

interface BasicsTabProps {
  fields: ListingFormState;
  options?: ListingCatalogOptions;
  onChange: <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K]
  ) => void;
}

export default function BasicsTab({
  fields,
  options = FALLBACK_LISTING_OPTIONS,
  onChange,
}: BasicsTabProps) {
  const statusOptions = statusesForType(fields.type, options);
  const typeOptions = options.types.length
    ? options.types
    : FALLBACK_LISTING_OPTIONS.types;

  return (
    <div className="space-y-8">
      <section>
        <h2 className={adminSectionTitleClassName}>Listing basics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="listing-type" className={adminLabelClassName}>
              Type
            </label>
            <div className="relative">
              <select
                id="listing-type"
                value={fields.type}
                onChange={(e) =>
                  onChange('type', e.target.value as ListingType)
                }
                className={adminSelectClassName}
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {listingTypeLabel(type)}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
          <div>
            <label htmlFor="listing-status" className={adminLabelClassName}>
              Status
            </label>
            <div className="relative">
              <select
                id="listing-status"
                value={fields.status}
                onChange={(e) =>
                  onChange('status', e.target.value as ListingStatus)
                }
                className={adminSelectClassName}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {listingStatusLabel(status)}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="listing-title" className={adminLabelClassName}>
              Title
            </label>
            <input
              id="listing-title"
              value={fields.title}
              onChange={(e) => onChange('title', e.target.value)}
              className={adminInputClassName}
              required
              placeholder="2BR East Village"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="listing-address" className={adminLabelClassName}>
              Address
            </label>
            <input
              id="listing-address"
              value={fields.address}
              onChange={(e) => onChange('address', e.target.value)}
              className={adminInputClassName}
              required
              placeholder="123 E 7th St, New York, NY"
            />
          </div>
          <div>
            <label htmlFor="listing-borough" className={adminLabelClassName}>
              Borough
            </label>
            <input
              id="listing-borough"
              value={fields.borough}
              onChange={(e) => onChange('borough', e.target.value)}
              className={adminInputClassName}
              required
              placeholder="Manhattan"
            />
          </div>
          <div>
            <label
              htmlFor="listing-neighborhood"
              className={adminLabelClassName}
            >
              Neighborhood
            </label>
            <input
              id="listing-neighborhood"
              value={fields.neighborhood}
              onChange={(e) => onChange('neighborhood', e.target.value)}
              className={adminInputClassName}
              placeholder="East Village"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
