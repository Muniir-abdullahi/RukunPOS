import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
        {...props}
      />
    </div>
  );
}

export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 py-4">
      {children}
    </div>
  );
}
