'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { PaginationComponent } from './Pagination';
import { EmptyState } from './EmptyState';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface DataTableFilter {
  key: string;
  value: string;
  operator?: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  emptyStateMessage?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  sortable = true,
  filterable = true,
  searchable = true,
  pagination = true,
  pageSize = 10,
  className = '',
  emptyStateMessage = 'No data available',
  onRowClick,
  loading = false
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<DataTableFilter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchable) {
      result = result.filter(row =>
        columns.some(column => {
          const value = getNestedValue(row, String(column.key));
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    if (filters.length > 0) {
      result = result.filter(row =>
        filters.every(filter => {
          const value = getNestedValue(row, String(filter.key));
          const filterValue = filter.value.toLowerCase();
          const cellValue = String(value).toLowerCase();

          switch (filter.operator) {
            case 'equals':
              return cellValue === filterValue;
            case 'startsWith':
              return cellValue.startsWith(filterValue);
            case 'endsWith':
              return cellValue.endsWith(filterValue);
            default: // contains
              return cellValue.includes(filterValue);
          }
        })
      );
    }

    return result;
  }, [data, searchTerm, filters, columns, searchable]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, String(sortColumn));
      const bValue = getNestedValue(b, String(sortColumn));

      const aStr = String(aValue || '');
      const bStr = String(bValue || '');

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;

    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => {
      const existingFilter = prev.find(f => f.key === columnKey);
      if (existingFilter) {
        if (value === '') {
          return prev.filter(f => f.key !== columnKey);
        }
        return prev.map(f => f.key === columnKey ? { ...f, value } : f);
      } else {
        if (value === '') return prev;
        return [...prev, { key: columnKey, value, operator: 'contains' }];
      }
    });
  };

  const getNestedValue = (obj: Record<string, unknown>, path: string) => {
    return path.split('.').reduce((current: unknown, key: string) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4" />
    ) : (
      <ChevronDownIcon className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-gray-200 dark:border-gray-700">
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg ${className}`}>
        <EmptyState type="no-data" title={emptyStateMessage} />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg ${className}`}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            {searchable && (
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {filterable && (
              <div className="flex gap-2 flex-wrap">
                {columns
                  .filter(col => col.filterable)
                  .map(column => {
                    const filter = filters.find(f => f.key === column.key);
                    return (
                      <div key={String(column.key)} className="flex items-center gap-2">
                        <FunnelIcon className="h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={`Filter ${column.label}...`}
                          value={filter?.value || ''}
                          onChange={(e) => handleFilter(String(column.key), e.target.value)}
                          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    column.sortable && sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortable && getSortIcon(String(column.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {column.render
                      ? column.render(getNestedValue(row, String(column.key)), row)
                      : String(getNestedValue(row, String(column.key)) || '')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Results summary */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400">
        Showing {paginatedData.length} of {sortedData.length} results
        {searchTerm && ` for "${searchTerm}"`}
      </div>
    </div>
  );
}
