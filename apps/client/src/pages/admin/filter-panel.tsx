import { useState } from 'react';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import { AnimalSummary } from '@interfaces/animal-summary.ts';
import { FilterState, Gender } from '@interfaces/filter-state.ts';

interface FilterPanelProps {
  cats: AnimalSummary[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterPanel({ cats, filters, onFiltersChange }: FilterPanelProps) {
  const [showFilters, setShowFilters] = useState(false);

  const locations = Array.from(new Set(cats.map(c => c.location))).sort();
  const fosterHomes = Array.from(new Set(cats.map(c => c.fosterHome))).sort();
  
  const activeFilterCount = 
    filters.location.length +
    filters.fosterHome.length +
    filters.gender.length +
    filters.ageGroup.length +
    (filters.sterilised !== null ? 1 : 0) +
    (filters.medicalOngoing !== null ? 1 : 0) +
    (filters.hasOverdueTasks !== null ? 1 : 0) +
    (filters.hasDueSoonTasks !== null ? 1 : 0) +
    (filters.published !== null ? 1 : 0);

  const handleClearFilters = () => {
    onFiltersChange({
      location: [],
      fosterHome: [],
      gender: [],
      ageGroup: [],
      sterilised: null,
      medicalOngoing: null,
      hasOverdueTasks: null,
      hasDueSoonTasks: null,
      published: null,
      searchQuery: '',
    });
  };

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onFiltersChange({ ...filters, [key]: newArray });
  };

  const toggleBooleanFilter = (key: keyof FilterState, value: boolean | null) => {
    onFiltersChange({ ...filters, [key]: filters[key] === value ? null : value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4 space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Otsi..."
            value={filters.searchQuery}
            onChange={e => onFiltersChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base flex-1 sm:flex-initial justify-center"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Filtrid</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Tühjenda</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asukoht</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {locations.map(location => (
                <label key={location} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.location.includes(location)}
                    onChange={() => toggleArrayFilter('location', location)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hoiukodu</label>
            <div className="space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
              {fosterHomes.map(home => (
                <label key={home} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.fosterHome.includes(home)}
                    onChange={() => toggleArrayFilter('fosterHome', home)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{home}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sugu</label>
            <div className="space-y-2">
              {(['Male', 'Female', 'Unknown'] as Gender[]).map(gender => (
                <label key={gender} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.gender.includes(gender)}
                    onChange={() => toggleArrayFilter('gender', gender)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{gender === 'Male' ? 'Isane' : gender === 'Female' ? 'Emane' : 'Teadmata'}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vanusegrupp</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.ageGroup.includes('kitten')}
                  onChange={() => toggleArrayFilter('ageGroup', 'kitten')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Kassipoeg (&lt; 12 kuud)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.ageGroup.includes('adult')}
                  onChange={() => toggleArrayFilter('ageGroup', 'adult')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Täiskasvanud (12+ kuud)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staatus</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.sterilised === true}
                  onChange={() => toggleBooleanFilter('sterilised', true)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Steriliseeritud</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.medicalOngoing === true}
                  onChange={() => toggleBooleanFilter('medicalOngoing', true)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Käimasolev ravi</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.published === true}
                  onChange={() => toggleBooleanFilter('published', true)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Avaldatud</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ülesanded</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasOverdueTasks === true}
                  onChange={() => toggleBooleanFilter('hasOverdueTasks', true)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Tähtaja ületanud</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasDueSoonTasks === true}
                  onChange={() => toggleBooleanFilter('hasDueSoonTasks', true)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Tähtaeg läheneb</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}