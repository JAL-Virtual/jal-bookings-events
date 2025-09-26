'use client';

import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, TrashIcon } from '@heroicons/react/24/outline';
import { UTCClock } from './UTCClock';

interface FilterState {
  flightNumber?: string;
  aircraft?: string;
  departure?: string;
  arrival?: string;
  time?: string;
  status?: string;
}

interface SlotPageHeaderProps {
  showFilter?: boolean;
  appliedFilters?: Partial<FilterState>;
  searchedFlightNumber?: string | null;
  onFlightSearch?: (flightNumber: string) => void;
  onFilterChange?: (state: Partial<FilterState>, filterKeyCount: number) => void;
  onFilterStateChange?: (isOpen: boolean) => void;
}

export const SlotPageHeader: React.FC<SlotPageHeaderProps> = ({
  showFilter = true,
  appliedFilters = {},
  searchedFlightNumber,
  onFlightSearch,
  onFilterChange,
  onFilterStateChange
}) => {
  const filterRootRef = useRef<HTMLDivElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [flightSearchValue, setFlightSearchValue] = useState(searchedFlightNumber ?? "");

  useEffect(() => {
    if (onFilterStateChange) {
      onFilterStateChange(isFilterOpen);
    }
  }, [isFilterOpen, onFilterStateChange]);

  // Simple outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRootRef.current && !filterRootRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterButtonBackground = useMemo(() => {
    return isFilterOpen 
      ? "bg-blue-600 text-white rounded-b-none" 
      : "bg-gray-700 text-blue-400 hover:bg-gray-600";
  }, [isFilterOpen]);

  const appliedFiltersCount = useMemo(() => {
    return Object.keys(appliedFilters ?? {}).filter((key) => {
      const objKey = key as keyof FilterState;
      return appliedFilters[objKey] !== undefined && appliedFilters[objKey] !== null;
    }).length;
  }, [appliedFilters]);

  const onFlightSearchSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!onFlightSearch) {
      return;
    }
    onFlightSearch(flightSearchValue);
  };

  const onFiltersApplied = (filterState: Partial<FilterState>) => {
    setIsFilterOpen(false);
    if (!onFilterChange) {
      return;
    }
    onFilterChange(filterState, appliedFiltersCount);
  };

  return (
    <div className="flex items-center p-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <form onSubmit={onFlightSearchSubmit} className="w-80">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            aria-label="Search flights"
            placeholder="Search flights..."
            value={flightSearchValue}
            onChange={(evt) => setFlightSearchValue(evt.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>

      <div className="flex ml-auto items-center space-x-4">
        <div className="hidden md:block">
          <UTCClock />
        </div>
        {showFilter && (
          <>
            <span className="text-gray-400">|</span>
            {appliedFiltersCount > 0 && !(appliedFiltersCount === 1 && appliedFilters.flightNumber) ? (
              <button
                onClick={() => onFiltersApplied({})}
                className="flex items-center px-3 py-1 bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-600/20 dark:hover:bg-red-600/30 transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">Reset</span>
              </button>
            ) : (
              <div className="relative" ref={filterRootRef}>
                <button
                  onClick={() => setIsFilterOpen(prevState => !prevState)}
                  className={`flex items-center px-3 py-1 rounded-md transition-colors ${filterButtonBackground}`}
                  aria-haspopup="true"
                  aria-expanded={isFilterOpen}
                >
                  <FunnelIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Filter</span>
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 z-50 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Flight Number
                        </label>
                        <input
                          type="text"
                          value={appliedFilters.flightNumber || ''}
                          onChange={(e) => onFiltersApplied({ ...appliedFilters, flightNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Aircraft
                        </label>
                        <input
                          type="text"
                          value={appliedFilters.aircraft || ''}
                          onChange={(e) => onFiltersApplied({ ...appliedFilters, aircraft: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onFiltersApplied({})}
                          className="flex-1 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
