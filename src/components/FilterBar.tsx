'use client';

import { Search, ArrowUpDown, LayoutGrid, List, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedRegion: string;
  onRegionChange: (val: string) => void;
  selectedSubregion: string;
  onSubregionChange: (val: string) => void;
  subregions: string[];
  sortOption: string;
  onSortChange: (val: string) => void;
  filterStatus: {
    independentOnly: boolean;
    unMemberOnly: boolean;
    landlockedOnly: boolean;
  };
  onToggleStatus: (key: 'independentOnly' | 'unMemberOnly' | 'landlockedOnly') => void;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (val: 'grid' | 'compact') => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const REGIONS = [
  { id: 'all', name: 'All' },
  { id: 'Africa', name: 'Africa' },
  { id: 'Americas', name: 'Americas' },
  { id: 'Asia', name: 'Asia' },
  { id: 'Europe', name: 'Europe' },
  { id: 'Oceania', name: 'Oceania' },
  { id: 'Antarctic', name: 'Antarctic' },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedSubregion,
  onSubregionChange,
  subregions,
  sortOption,
  onSortChange,
  filterStatus,
  onToggleStatus,
  viewMode,
  onViewModeChange,
  onResetFilters,
  totalFiltered,
}: FilterBarProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRegion !== 'all' ||
    selectedSubregion !== 'all' ||
    filterStatus.independentOnly ||
    filterStatus.unMemberOnly ||
    filterStatus.landlockedOnly ||
    sortOption !== 'name_asc';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-3 shadow-xs space-y-3">
      {/* Top Row: Search, Sort and View Mode */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by country, capital, or code (e.g. Bangladesh, Dhaka, BD)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-md border border-[#e2d5b5] dark:border-slate-700 bg-white/90 dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200 dark:bg-slate-700 rounded-md w-4 h-4 flex items-center justify-center cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Sort Select */}
          <div className="relative flex items-center min-w-[160px]">
            <ArrowUpDown className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full pl-8 pr-6 py-2 rounded-md border border-[#e2d5b5] dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="name_asc">Name (A → Z)</option>
              <option value="name_desc">Name (Z → A)</option>
              <option value="pop_desc">Population (High → Low)</option>
              <option value="pop_asc">Population (Low → High)</option>
              <option value="area_desc">Area (Largest First)</option>
              <option value="area_asc">Area (Smallest First)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded-md border border-[#e2d5b5] dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              aria-label="Compact list view"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'compact'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-2 rounded-md border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Region Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {REGIONS.map((r) => {
          const isSelected = selectedRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onRegionChange(r.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#e8dcbf] dark:hover:bg-slate-700 border border-[#e2d5b5]/60 dark:border-transparent'
              }`}
            >
              {r.name}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Subregion & Filter Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e2d5b5]/60 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {subregions.length > 0 && selectedRegion !== 'all' && (
            <select
              value={selectedSubregion}
              onChange={(e) => onSubregionChange(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-[#e2d5b5] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Subregions</option>
              {subregions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => onToggleStatus('independentOnly')}
            className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer ${
              filterStatus.independentOnly
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-[#e2d5b5] dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white dark:bg-slate-900'
            }`}
          >
            Independent
          </button>

          <button
            onClick={() => onToggleStatus('unMemberOnly')}
            className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer ${
              filterStatus.unMemberOnly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-[#e2d5b5] dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white dark:bg-slate-900'
            }`}
          >
            UN Member
          </button>

          <button
            onClick={() => onToggleStatus('landlockedOnly')}
            className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold transition-colors cursor-pointer ${
              filterStatus.landlockedOnly
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-[#e2d5b5] dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 bg-white dark:bg-slate-900'
            }`}
          >
            Landlocked
          </button>
        </div>

        <div className="text-slate-500 dark:text-slate-400 font-medium ml-auto text-xs">
          Showing: <span className="text-blue-600 dark:text-blue-400 font-bold">{totalFiltered}</span>
        </div>
      </div>
    </div>
  );
}
