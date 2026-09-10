'use client';

import type { ListingStatus, ListingType } from '@/lib/types/listing';
import SelectChevron from '../SelectChevron';
import {
  adminInputClassName,
  adminLabelClassName,
  adminSectionTitleClassName,
  adminSelectClassName,
} from '../admin-ui';
import type { ListingFormState } from './form-state';
import { statusesForType } from './form-state';

interface BasicsTabProps {
  fields: ListingFormState;
  onChange: <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K]
  ) => void;
}

export default function BasicsTab({ fields, onChange }: BasicsTabProps) {
  const statusOptions = statusesForType(fields.type);

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
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
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
                    {status}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="listing-title" className={adminLabelClassName}>
              Title
            </label>
            <input
              id="listing-title"
              required
              value={fields.title}
              onChange={(e) => onChange('title', e.target.value)}
              className={adminInputClassName}
              placeholder="e.g. Bright 2BR in East Village"
            />
          </div>
          <div>
            <label htmlFor="listing-address" className={adminLabelClassName}>
              Address
            </label>
            <input
              id="listing-address"
              required
              value={fields.address}
              onChange={(e) => onChange('address', e.target.value)}
              className={adminInputClassName}
              placeholder="Street address, city, state"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="listing-borough" className={adminLabelClassName}>
                Borough
              </label>
              <input
                id="listing-borough"
                required
                value={fields.borough}
                onChange={(e) => onChange('borough', e.target.value)}
                className={adminInputClassName}
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
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
