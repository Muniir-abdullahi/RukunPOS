import React from 'react';

// Unified simple form fields for the MVP foundation

export function FormInput({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
        {...props}
      />
    </div>
  );
}

export function TextArea({ label, id, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
        {...props}
      />
    </div>
  );
}

export function SelectInput({ label, id, options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: {label: string, value: string}[] }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        id={id}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border bg-white"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// Adding DateInput as a wrapper around simple date input type
export function DateInput({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <FormInput type="date" label={label} id={id} {...props} />
  );
}
