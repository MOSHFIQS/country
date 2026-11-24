'use client';

import { useState, useMemo, useEffect } from 'react';
import { Country } from '@/types/country';
import CountryCard from '@/components/CountryCard';
import FilterBar from '@/components/FilterBar';
import StatsOverview from '@/components/StatsOverview';
import ComparisonDrawer from '@/components/ComparisonDrawer';
import { Globe } from 'lucide-react';

interface CountryExplorerClientProps {
  initialCountries: Country[];
}

export default function CountryExplorerClient({
  initialCountries,
}: CountryExplorerClientProps) {
  // Directly initialize countries from server props - ZERO SKELETON DELAY
  const [countries] = useState<Country[]>(initialCountries);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedSubregion, setSelectedSubregion] = useState('all');
  const [sortOption, setSortOption] = useState('name_asc');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [filterStatus, setFilterStatus] = useState({
    independentOnly: false,
    unMemberOnly: false,
    landlockedOnly: false,
  });

  // User Interactive lists (Favorites & Compare)
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);
  const [comparedCountries, setComparedCountries] = useState<Country[]>([]);

  // Load favorites & compare from localStorage on mount
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('fav_countries') || '[]');
      if (Array.isArray(favs)) setFavoriteCodes(favs);

      const comp = JSON.parse(localStorage.getItem('compare_countries') || '[]');
      if (Array.isArray(comp)) setComparedCountries(comp);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const availableSubregions = useMemo(() => {
    const list = new Set<string>();
    countries.forEach((c) => {
      if (
        c.subregion &&
        (selectedRegion === 'all' || c.region.toLowerCase() === selectedRegion.toLowerCase())
      ) {
        list.add(c.subregion);
      }
    });
    return Array.from(list).sort();
  }, [countries, selectedRegion]);

  useEffect(() => {
    if (selectedSubregion !== 'all' && !availableSubregions.includes(selectedSubregion)) {
      setSelectedSubregion('all');
    }
  }, [selectedRegion, availableSubregions, selectedSubregion]);

  const stats = useMemo(() => {
    let totalPopulation = 0;
    let independentCount = 0;
    let unMemberCount = 0;

    countries.forEach((c) => {
      totalPopulation += c.population || 0;
      if (c.independent) independentCount++;
      if (c.unMember) unMemberCount++;
    });

    return {
      totalCountries: countries.length,
      totalPopulation,
      independentCount,
      unMemberCount,
    };
  }, [countries]);

  const filteredCountries = useMemo(() => {
    let result = countries;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((c) => {
        const common = c.name?.common?.toLowerCase() || '';
        const official = c.name?.official?.toLowerCase() || '';
        const capitals = (c.capital || []).map((cap) => cap.toLowerCase()).join(' ');
        const cca2 = c.cca2?.toLowerCase() || '';
        const cca3 = c.cca3?.toLowerCase() || '';
        return (
          common.includes(q) ||
          official.includes(q) ||
          capitals.includes(q) ||
          cca2 === q ||
          cca3 === q
        );
      });
    }

    if (selectedRegion !== 'all') {
      result = result.filter((c) => c.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    if (selectedSubregion !== 'all') {
      result = result.filter(
        (c) => c.subregion?.toLowerCase() === selectedSubregion.toLowerCase()
      );
    }

    if (filterStatus.independentOnly) {
      result = result.filter((c) => Boolean(c.independent));
    }
    if (filterStatus.unMemberOnly) {
      result = result.filter((c) => Boolean(c.unMember));
    }
    if (filterStatus.landlockedOnly) {
      result = result.filter((c) => Boolean(c.landlocked));
    }

    return [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name_desc':
          return (b.name?.common || '').localeCompare(a.name?.common || '');
        case 'pop_desc':
          return (b.population || 0) - (a.population || 0);
        case 'pop_asc':
          return (a.population || 0) - (b.population || 0);
        case 'area_desc':
          return (b.area || 0) - (a.area || 0);
        case 'area_asc':
          return (a.area || 0) - (b.area || 0);
        case 'name_asc':
        default:
          return (a.name?.common || '').localeCompare(b.name?.common || '');
      }
    });
  }, [countries, searchQuery, selectedRegion, selectedSubregion, filterStatus, sortOption]);

  const handleToggleFavorite = (country: Country) => {
    let updated: string[];
    if (favoriteCodes.includes(country.cca3)) {
      updated = favoriteCodes.filter((code) => code !== country.cca3);
    } else {
      updated = [...favoriteCodes, country.cca3];
    }
    setFavoriteCodes(updated);
    localStorage.setItem('fav_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorites_updated'));
  };

  const handleToggleCompare = (country: Country) => {
    let updated: Country[];
    const exists = comparedCountries.some((c) => c.cca3 === country.cca3);
    if (exists) {
      updated = comparedCountries.filter((c) => c.cca3 !== country.cca3);
    } else {
      if (comparedCountries.length >= 4) {
        alert('You can compare up to 4 countries at once.');
        return;
      }
      updated = [...comparedCountries, country];
    }
    setComparedCountries(updated);
    localStorage.setItem('compare_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare_updated'));
  };

  const handleRemoveCompare = (cca3: string) => {
    const updated = comparedCountries.filter((c) => c.cca3 !== cca3);
    setComparedCountries(updated);
    localStorage.setItem('compare_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare_updated'));
  };

  const handleClearCompare = () => {
    setComparedCountries([]);
    localStorage.removeItem('compare_countries');
    window.dispatchEvent(new Event('compare_updated'));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedSubregion('all');
    setSortOption('name_asc');
    setFilterStatus({
      independentOnly: false,
      unMemberOnly: false,
      landlockedOnly: false,
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      {/* Global Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Controls & Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        selectedSubregion={selectedSubregion}
        onSubregionChange={setSelectedSubregion}
        subregions={availableSubregions}
        sortOption={sortOption}
        onSortChange={setSortOption}
        filterStatus={filterStatus}
        onToggleStatus={(key) =>
          setFilterStatus((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        totalFiltered={filteredCountries.length}
      />

      {/* Country List / Grid - 5 COLUMNS ON XL SCREEN, ZERO SKELETON */}
      {filteredCountries.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5'
              : 'flex flex-col gap-2.5'
          }
        >
          {filteredCountries.map((c) => (
            <CountryCard
              key={c.cca3}
              country={c}
              isFavorite={favoriteCodes.includes(c.cca3)}
              isCompared={comparedCountries.some((comp) => comp.cca3 === c.cca3)}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <Globe className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No countries found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No matches found for &quot;{searchQuery}&quot;. Try adjusting your search or reset filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-1 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Floating Bottom Comparison Drawer */}
      <ComparisonDrawer
        comparedCountries={comparedCountries}
        onRemove={handleRemoveCompare}
        onClear={handleClearCompare}
      />
    </div>
  );
}
