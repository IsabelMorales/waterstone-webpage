'use client';

import { useEffect, useState } from 'react';
import type {
  FurnishedStatus,
  ListingCatalogOptions,
  ListingFeeItem,
  ListingFees,
} from '@/lib/types/listing';
import { defaultFeeItem } from '@/lib/listing-defaults';
import {
  FALLBACK_LISTING_OPTIONS,
  furnishedStatusOptions,
} from '@/lib/listing-options';
import { formatFeeAmount, formatPrice } from '@/lib/listings-format';
import { cn } from '@/lib/utils';
import {
  adminInputClassName,
  adminLabelClassName,
  adminNumberClassName,
  adminPrimaryBtnClassName,
  adminSectionTitleClassName,
  adminSecondaryBtnClassName,
} from '../admin-ui';
import type { ListingFormState } from './form-state';
import { AmenityCheckbox, AmenityRadio } from './AmenityControls';

interface CostsTabProps {
  fields: ListingFormState;
  options?: ListingCatalogOptions;
  onChange: <K extends keyof ListingFormState>(
    key: K,
    value: ListingFormState[K]
  ) => void;
  onFeesChange: (fees: ListingFees) => void;
}

type FeeEditTarget =
  | { kind: 'application' }
  | { kind: 'securityDeposit' }
  | { kind: 'other'; index: number };

const editBtnClassName = cn(
  'inline-flex items-center justify-center rounded-md px-3.5 py-1.5',
  'text-sm font-semibold text-[var(--color-almost-white)]',
  'bg-brand-primary hover:bg-brand-accent transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'
);

function FeeCard({
  title,
  fee,
  onEdit,
  onRemove,
}: {
  title: string;
  fee: ListingFeeItem;
  onEdit: () => void;
  onRemove?: () => void;
}) {
  const tags = [
    { label: fee.required ? 'Required' : 'Optional', active: fee.required },
    {
      label: fee.oneTime ? 'One-time fee' : 'Recurring',
      active: fee.oneTime,
    },
    {
      label: fee.refundable ? 'Refundable' : 'Non-refundable',
      active: fee.refundable,
    },
  ];

  return (
    <div className="rounded-lg border border-gray-700/80 bg-gray-900/40 px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-[var(--color-almost-white)]">
            {title}
          </p>
          <p className="mt-1 text-lg text-brand-accent">
            {formatFeeAmount(fee.amount)}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 list-none">
            {tags.map((tag) => (
              <li
                key={tag.label}
                className={cn(
                  'rounded-md border px-2 py-0.5 text-xs',
                  tag.active
                    ? 'border-brand-accent/50 bg-brand-primary/15 text-brand-accent'
                    : 'border-gray-600/80 text-gray-500'
                )}
              >
                {tag.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <button type="button" onClick={onEdit} className={editBtnClassName}>
            Edit
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-sm text-red-300 hover:text-red-200 transition-colors px-1"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeeEditModal({
  title,
  fee,
  showName,
  onSave,
  onClose,
}: {
  title: string;
  fee: ListingFeeItem;
  showName?: boolean;
  onSave: (fee: ListingFeeItem) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ListingFeeItem>(fee);
  const [amountText, setAmountText] = useState(
    fee.amount === 0 ? '' : String(fee.amount)
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  function handleAmountChange(raw: string) {
    setAmountText(raw);
    if (raw.trim() === '') {
      setDraft((prev) => ({ ...prev, amount: 0 }));
      return;
    }
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0) {
      setDraft((prev) => ({ ...prev, amount: n }));
    }
  }

  function handleSave() {
    onSave({
      ...draft,
      name: draft.name.trim(),
      amount:
        amountText.trim() === ''
          ? 0
          : Number.isFinite(Number(amountText))
            ? Number(amountText)
            : draft.amount,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fee-edit-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close fee editor"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 px-6 py-6 shadow-2xl">
        <h3
          id="fee-edit-title"
          className="text-lg font-semibold text-[var(--color-almost-white)]"
        >
          {title}
        </h3>

        <div className="mt-6 space-y-5">
          {showName && (
            <div>
              <label htmlFor="fee-name" className={adminLabelClassName}>
                Fee name
              </label>
              <input
                id="fee-name"
                value={draft.name}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                className={adminInputClassName}
                placeholder="e.g. Pet deposit"
                autoFocus
              />
            </div>
          )}

          <div>
            <label htmlFor="fee-amount" className={adminLabelClassName}>
              Amount
            </label>
            <input
              id="fee-amount"
              type="number"
              min="0"
              inputMode="decimal"
              value={amountText}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={adminNumberClassName}
              placeholder="0"
              autoFocus={!showName}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {(
              [
                ['required', 'Required'],
                ['oneTime', 'One-time'],
                ['refundable', 'Refundable'],
              ] as const
            ).map(([key, label]) => (
              <AmenityCheckbox
                key={key}
                id={`fee-${key}`}
                label={label}
                checked={draft[key]}
                onChange={(checked) =>
                  setDraft((prev) => ({ ...prev, [key]: checked }))
                }
              />
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(adminSecondaryBtnClassName, 'text-sm py-2.5 px-5')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={cn(adminPrimaryBtnClassName, 'text-sm py-2.5 px-5')}
          >
            Save fee
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CostsTab({
  fields,
  options = FALLBACK_LISTING_OPTIONS,
  onChange,
  onFeesChange,
}: CostsTabProps) {
  const [editing, setEditing] = useState<FeeEditTarget | null>(null);
  const furnishedOptions = furnishedStatusOptions(options);

  function priceHeading() {
    if (fields.type === 'rent') return 'Rent price';
    if (fields.type === 'sale') return 'Sale price';
    return 'Listing price';
  }

  function priceQuestion() {
    if (fields.type === 'rent') return "What's the base rent? (required)";
    if (fields.type === 'sale') return "What's the sale price? (required)";
    return "What's the listing price? (required)";
  }

  function resolveEditingFee(): ListingFeeItem | null {
    if (!editing) return null;
    if (editing.kind === 'application') return fields.fees.application;
    if (editing.kind === 'securityDeposit') return fields.fees.securityDeposit;
    return fields.fees.other[editing.index] || null;
  }

  function resolveEditingTitle(): string {
    if (!editing) return 'Edit fee';
    if (editing.kind === 'application') return 'Edit application fee';
    if (editing.kind === 'securityDeposit') return 'Edit security deposit';
    return 'Edit other fee';
  }

  function handleSaveFee(fee: ListingFeeItem) {
    if (!editing) return;
    if (editing.kind === 'application') {
      onFeesChange({ ...fields.fees, application: fee });
      return;
    }
    if (editing.kind === 'securityDeposit') {
      onFeesChange({ ...fields.fees, securityDeposit: fee });
      return;
    }
    const other = fields.fees.other.map((item, i) =>
      i === editing.index ? fee : item
    );
    onFeesChange({ ...fields.fees, other });
  }

  function addOtherFee() {
    const nextIndex = fields.fees.other.length;
    onFeesChange({
      ...fields.fees,
      other: [
        ...fields.fees.other,
        defaultFeeItem('', {
          required: false,
          oneTime: true,
          refundable: false,
        }),
      ],
    });
    setEditing({ kind: 'other', index: nextIndex });
  }

  function removeOther(index: number) {
    onFeesChange({
      ...fields.fees,
      other: fields.fees.other.filter((_, i) => i !== index),
    });
    setEditing(null);
  }

  const editingFee = resolveEditingFee();
  const priceNum = Number(fields.price) || 0;

  return (
    <div className="space-y-10">
      <section>
        <h2 className={adminSectionTitleClassName}>{priceHeading()}</h2>
        <div className="max-w-sm">
          <label htmlFor="listing-price" className={adminLabelClassName}>
            {priceQuestion()}
          </label>
          <input
            id="listing-price"
            type="number"
            min="0"
            required
            inputMode="decimal"
            value={fields.price}
            onChange={(e) => onChange('price', e.target.value)}
            className={adminNumberClassName}
          />
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Displayed as{' '}
          <span className="text-[var(--color-almost-white)] font-medium">
            {formatPrice(priceNum, fields.type)}
          </span>
        </p>

        <fieldset className="mt-8">
          <legend className={adminLabelClassName}>
            Is there a concession? (required)
          </legend>
          <div className="flex flex-wrap gap-5 mt-2">
            {(
              [
                [false, 'No'],
                [true, 'Yes'],
              ] as const
            ).map(([value, label]) => (
              <AmenityRadio
                key={label}
                id={`concession-${label.toLowerCase()}`}
                name="hasConcession"
                label={label}
                checked={fields.hasConcession === value}
                onChange={() => onChange('hasConcession', value)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className={adminLabelClassName}>
            Is this unit offered furnished? (required)
          </legend>
          <div className="flex flex-col gap-3 mt-2">
            {furnishedOptions.map((option) => (
              <AmenityRadio
                key={option.value}
                id={`furnished-${option.value}`}
                name="furnishedStatus"
                label={option.label}
                checked={fields.furnishedStatus === option.value}
                onChange={() =>
                  onChange('furnishedStatus', option.value as FurnishedStatus)
                }
              />
            ))}
          </div>
        </fieldset>
      </section>

      <section className="space-y-4">
        <h2 className={adminSectionTitleClassName}>Fees</h2>

        <FeeCard
          title={fields.fees.application.name}
          fee={fields.fees.application}
          onEdit={() => setEditing({ kind: 'application' })}
        />
        <FeeCard
          title={fields.fees.securityDeposit.name}
          fee={fields.fees.securityDeposit}
          onEdit={() => setEditing({ kind: 'securityDeposit' })}
        />

        <div className="pt-2">
          <h3 className="text-sm font-semibold text-[var(--color-almost-white)] mb-3">
            Other
          </h3>
          <div className="space-y-3">
            {fields.fees.other.map((fee, index) => (
              <FeeCard
                key={fee.id || `other-${index}`}
                title={fee.name || 'Untitled fee'}
                fee={fee}
                onEdit={() => setEditing({ kind: 'other', index })}
                onRemove={() => removeOther(index)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addOtherFee}
            className={cn(
              adminSecondaryBtnClassName,
              'mt-4 border-dashed text-sm'
            )}
          >
            + Add fee
          </button>
        </div>
      </section>

      {editing && editingFee && (
        <FeeEditModal
          key={
            editing.kind === 'other'
              ? `other-${editing.index}`
              : editing.kind
          }
          title={resolveEditingTitle()}
          fee={editingFee}
          showName={editing.kind === 'other'}
          onSave={handleSaveFee}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
