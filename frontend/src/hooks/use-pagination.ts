"use client";

import { useState } from "react";

/**
 * usePagination — Client-side pagination state management.
 *
 * Usage:
 *   const { page, limit, offset, goToPage, nextPage, prevPage } = usePagination()
 */
export function usePagination(initialPage = 1, initialLimit = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = (page - 1) * limit;

  function goToPage(newPage: number) {
    setPage(Math.max(1, newPage));
  }

  function nextPage() {
    setPage((p) => p + 1);
  }

  function prevPage() {
    setPage((p) => Math.max(1, p - 1));
  }

  function reset() {
    setPage(1);
  }

  return {
    page,
    limit,
    offset,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    reset,
  };
}
