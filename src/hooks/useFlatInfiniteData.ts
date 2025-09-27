"use client";

import { useMemo } from 'react';
import { Pagination } from '../types/ApiBase';

export function useFlatInfiniteData<T>(data: { pages: Pagination<T>[] } | undefined): T[] {
  return useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.reduce<T[]>((acc, page) => {
      return [...acc, ...page.data];
    }, []);
  }, [data]);
}