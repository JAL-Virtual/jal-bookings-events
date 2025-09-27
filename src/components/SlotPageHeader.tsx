import { ReactNode, FormEvent, useRef, useState, useEffect, useMemo } from 'react';
import { ActionButton } from './buttons/ActionButton';
import { Filter } from './Filter';
import { InputField } from './InputField';
import { UTCClock } from './UTCClock';
import { useOutsideClickHandler } from '../../hooks/useOutsideClickHandler';
import { useText } from '../../hooks/useText';
import { FiFilter, FiSearch, FiTrash } from 'react-icons/fi';
import { FilterState } from '../../types/Translations';

interface SlotPageHeaderProps {
  showFilter?: boolean;
  appliedFilters?: Partial<FilterState>;
  searchedFlightNumber?: string | null;
  onFlightSearch?: (flightNumber: string) => void;
  onFilterChange?: (state: Partial<FilterState>, filterKeyCount: number) => void;
  onFilterStateChange?: (isOpen: boolean) => void;
}

export function SlotPageHeader({
  showFilter = true, 
  appliedFilters = {}, 
  searchedFlightNumber,
  onFlightSearch, 
  onFilterChange, 
  onFilterStateChange
}: SlotPageHeaderProps) {
  const filterRootRef = useRef<HTMLDivElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [flightSearchValue, setFlightSearchValue] = useState(searchedFlightNumber ?? "");
  const { t } = useText();

  useEffect(() => {
    if (onFilterStateChange) {
      onFilterStateChange(isFilterOpen);
    }
  }, [isFilterOpen, onFilterStateChange]);

  useOutsideClickHandler(filterRootRef, () => {
    setIsFilterOpen(false);
  });

  const filterButtonBackground = useMemo(() => {
    return isFilterOpen ? "bg-blue-600 dark:bg-yellow-500 rounded-b-none" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white";
  }, [isFilterOpen]);

  const appliedFiltersCount = useMemo(() => {
    return Object.keys(appliedFilters ?? {}).filter((key) => {
      const objKey = key as keyof FilterState;
      return appliedFilters[objKey] !== undefined && appliedFilters[objKey] !== null;
    }).length;
  }, [appliedFilters]);

  const onFlightSearchSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!onFlightSearch) return;
    onFlightSearch(flightSearchValue);
  };

  const onFiltersApplied = (filterState: Partial<FilterState>) => {
    setIsFilterOpen(false);
    if (!onFilterChange) return;
    onFilterChange(filterState, appliedFiltersCount);
  };

  return (
    <div className="flex items-center p-8 bg-white dark:bg-black">
      <form onSubmit={onFlightSearchSubmit} className="w-36">
        <InputField
          icon={<FiSearch size={16} />}
          type="search"
          aria-label={t('flights.search')}
          placeholder={t('flights.search')}
          value={flightSearchValue}
          onChange={(evt) => setFlightSearchValue(evt.target.value)} 
        />
      </form>

      <div className="flex ml-auto">
        <div className="hidden md:block">
          <UTCClock />
        </div>
        {showFilter && (
          <>
            <span className="mx-3">|</span>
            {appliedFiltersCount > 0 && !(appliedFiltersCount === 1 && appliedFilters.flightNumber) ? (
              <ActionButton
                height="h-7"
                backgroundColor="bg-red-500"
                content={
                  <span className="font-medium text-xs p-2">
                    {t('flights.filter.reset')}
                  </span>
                }
                icon={<FiTrash size={19} />}
                onClick={() => onFiltersApplied({})} 
              />
            ) : (
              <div className="relative" ref={filterRootRef}>
                <ActionButton
                  height="h-7"
                  backgroundColor={filterButtonBackground}
                  content={
                    <span className={`font-medium text-xs p-2 ${isFilterOpen ? "text-white" : ""}`}>
                      {t('flights.filter.call')}
                    </span>
                  }
                  icon={<FiFilter aria-hidden="true" />}
                  onClick={() => setIsFilterOpen(prevState => !prevState)}
                  aria-haspopup="true"
                  aria-expanded={isFilterOpen}
                />
                {isFilterOpen && (
                  <div className="absolute right-0 z-50">
                    <Filter
                      appliedFilters={appliedFilters}
                      onChange={onFiltersApplied}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}