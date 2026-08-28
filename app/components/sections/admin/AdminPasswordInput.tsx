'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { adminInputClassName } from './admin-ui';

interface AdminPasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  className?: string;
}

export default function AdminPasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  placeholder,
  className,
}: AdminPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(adminInputClassName, 'pr-11', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className={cn(
          'absolute right-3 top-1/2 -translate-y-1/2 p-1',
          'text-gray-400 hover:text-[var(--color-almost-white)] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm'
        )}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-controls={id}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="h-5 w-5" strokeWidth={2} aria-hidden />
        ) : (
          <Eye className="h-5 w-5" strokeWidth={2} aria-hidden />
        )}
      </button>
    </div>
  );
}
