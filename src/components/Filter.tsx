import { FunctionComponent, useState } from "react";
import { InputField } from "./InputField";
import { ActionButton } from "./Button";
import { useText } from "../hooks/useText";

export interface FilterState {
  flightNumber?: string;
  aircraft?: string;
  departure?: string;
  arrival?: string;
  time?: string;
  status?: string;
}

interface FilterProps {
  appliedFilters?: Partial<FilterState>;
  onChange: (state: Partial<FilterState>) => void;
}

export const Filter: FunctionComponent<FilterProps> = ({ appliedFilters = {}, onChange }) => {
  const { t } = useText();
  const [localFilters, setLocalFilters] = useState<Partial<FilterState>>(appliedFilters);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onChange(clearedFilters);
  };

  return (
    <div className="w-64 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('flights.filter.flightNumber')}
          </label>
          <InputField
            type="text"
            placeholder={t('flights.filter.flightNumber')}
            value={localFilters.flightNumber || ''}
            onChange={(e) => handleFilterChange('flightNumber', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('flights.filter.aircraft')}
          </label>
          <InputField
            type="text"
            placeholder={t('flights.filter.aircraft')}
            value={localFilters.aircraft || ''}
            onChange={(e) => handleFilterChange('aircraft', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('flights.filter.departure')}
          </label>
          <InputField
            type="text"
            placeholder={t('flights.filter.departure')}
            value={localFilters.departure || ''}
            onChange={(e) => handleFilterChange('departure', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('flights.filter.arrival')}
          </label>
          <InputField
            type="text"
            placeholder={t('flights.filter.arrival')}
            value={localFilters.arrival || ''}
            onChange={(e) => handleFilterChange('arrival', e.target.value)}
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <ActionButton
            width="w-full"
            height="h-8"
            backgroundColor="bg-gray-200 dark:bg-gray-600"
            backgroundFilled={false}
            content={
              <span className="text-gray-800 dark:text-gray-200 text-xs font-semibold">
                {t('flights.filter.clear')}
              </span>
            }
            onClick={handleClear}
          />
          <ActionButton
            width="w-full"
            height="h-8"
            backgroundColor="bg-blue-600"
            content={
              <span className="text-white text-xs font-semibold">
                {t('flights.filter.apply')}
              </span>
            }
            onClick={handleApply}
          />
        </div>
      </div>
    </div>
  );
};
