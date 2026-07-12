"use client";

import { useEffect, useState } from "react";

/**
 * useDebounce — Delays updating a value until after a specified delay.
 *
 * Useful for search inputs to avoid firing queries on every keystroke.
 *
 * @param value — The value to debounce
 * @param delay — Delay in milliseconds (default: 300ms)
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchQuery, 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
