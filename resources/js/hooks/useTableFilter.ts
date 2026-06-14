import { useCallback, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface UseTableFilterOptions {
  only: string[];
  defaultFilters?: Record<string, any>;
  debounceMs?: number;
}

export function useTableFilter({
  only,
  defaultFilters = {},
  debounceMs = 400,
}: UseTableFilterOptions) {
  const [filters, setFilters] = useState<Record<string, any>>({
    page: 1,
    per_page: 25,
    ...defaultFilters,
  });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reload = useCallback(
    (newFilters: Record<string, any>, debounce = false) => {
      const merged = { ...filters, ...newFilters };
      setFilters(merged);

      const execute = () => {
        setLoading(true);
        router.visit(window.location.pathname, {
          method: 'get',
          data: merged,
          preserveUrl: true,
          preserveState: true,
          preserveScroll: true,
          only,
          onFinish: () => setLoading(false),
        } as any);
      };

      if (debounce) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(execute, debounceMs);
        return;
      }

      execute();
    },
    [debounceMs, filters, only],
  );

  const reset = useCallback(() => {
    reload({ page: 1, per_page: 25, search: '', ...defaultFilters });
  }, [defaultFilters, reload]);

  return { filters, loading, reload, reset };
}
