'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Country } from '@/types/country';
import CountryCard from '@/components/CountryCard';
import { Bookmark, ArrowLeft, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);
  const [comparedCountries, setComparedCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success) {
          setCountries(json.data);
        }

        const favs = JSON.parse(localStorage.getItem('fav_countries') || '[]');
        if (Array.isArray(favs)) setFavoriteCodes(favs);

        const comp = JSON.parse(localStorage.getItem('compare_countries') || '[]');
        if (Array.isArray(comp)) setComparedCountries(comp);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const favoriteCountries = countries.filter((c) => favoriteCodes.includes(c.cca3));

  const handleToggleFavorite = (country: Country) => {
    const updated = favoriteCodes.filter((code) => code !== country.cca3);
    setFavoriteCodes(updated);
    localStorage.setItem('fav_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('favorites_updated'));
  };

  const handleClearAll = () => {
    setFavoriteCodes([]);
    localStorage.removeItem('fav_countries');
    window.dispatchEvent(new Event('favorites_updated'));
  };

  const handleToggleCompare = (country: Country) => {
    let updated: Country[];
    if (comparedCountries.some((c) => c.cca3 === country.cca3)) {
      updated = comparedCountries.filter((c) => c.cca3 !== country.cca3);
    } else {
      if (comparedCountries.length >= 4) {
        alert('Max 4 countries to compare');
        return;
      }
      updated = [...comparedCountries, country];
    }
    setComparedCountries(updated);
    localStorage.setItem('compare_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare_updated'));
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Explorer</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Favorite Nations ({favoriteCountries.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookmarked countries for quick reference and tracking.
          </p>
        </div>

        {favoriteCountries.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Favorites</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-64 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : favoriteCountries.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 space-y-3">
          <Bookmark className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No saved countries yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any country card to save it here.
          </p>
          <Link
            href="/"
            className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
          {favoriteCountries.map((c) => (
            <CountryCard
              key={c.cca3}
              country={c}
              isFavorite={true}
              isCompared={comparedCountries.some((comp) => comp.cca3 === c.cca3)}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  );
}
