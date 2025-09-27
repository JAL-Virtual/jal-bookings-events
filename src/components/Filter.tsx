interface FilterProps {
  appliedFilters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
}

export function Filter({ appliedFilters, onChange }: FilterProps) {
  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...appliedFilters, [key]: value };
    onChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-64">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filters
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Flight Number
          </label>
          <input
            type="text"
            value={(appliedFilters.flightNumber as string) || ''}
            onChange={(e) => handleFilterChange('flightNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter flight number"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aircraft
          </label>
          <input
            type="text"
            value={(appliedFilters.aircraft as string) || ''}
            onChange={(e) => handleFilterChange('aircraft', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter aircraft type"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Origin
          </label>
          <input
            type="text"
            value={(appliedFilters.origin as string) || ''}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter origin ICAO"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Destination
          </label>
          <input
            type="text"
            value={(appliedFilters.destination as string) || ''}
            onChange={(e) => handleFilterChange('destination', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Enter destination ICAO"
          />
        </div>
      </div>
      
      <div className="mt-6 flex space-x-2">
        <button
          onClick={() => onChange({})}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={() => onChange(appliedFilters)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}