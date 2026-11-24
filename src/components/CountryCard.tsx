'use client';

import Link from 'next/link';
import { Country } from '@/types/country';
import CountryFlagImage from './CountryFlagImage';
import { Heart, Scale, MapPin, Users, Globe, ExternalLink, Check } from 'lucide-react';

interface CountryCardProps {
  country: Country;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (country: Country) => void;
  onToggleCompare: (country: Country) => void;
  viewMode?: 'grid' | 'compact';
}

export default function CountryCard({
  country,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  viewMode = 'grid',
}: CountryCardProps) {
  const { name, flags, population, region, subregion, capital, area, independent, cca2, cca3, flag, maps } = country;

  const formattedPop = new Intl.NumberFormat('en-US').format(population);
  const formattedArea = area ? `${new Intl.NumberFormat('en-US').format(area)} km²` : 'N/A';
  const capitalName = capital && capital.length > 0 ? capital.join(', ') : 'N/A';

  if (viewMode === 'compact') {
    return (
      <div className="group flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors shadow-xs">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-14 h-9 rounded-md overflow-hidden flex-shrink-0 border border-[#e2d5b5] dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <CountryFlagImage
              src={flags.png || flags.svg}
              alt={flags.alt || `${name.common} Flag`}
              cca2={cca2}
              cca3={cca3}
              countryName={name.common}
              flagEmoji={flag}
              sizes="60px"
            />
          </div>
          <div className="min-w-0">
            <Link
              href={`/country/${cca3.toLowerCase()}`}
              className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block text-sm"
            >
              {name.common}
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{region}</span>
              <span>•</span>
              <span className="truncate">Capital: {capitalName}</span>
              <span>•</span>
              <span>Pop: {formattedPop}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleCompare(country)}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
            className={`p-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              isCompared
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-[#e2d5b5] dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleFavorite(country)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-500'
                : 'border-[#e2d5b5] dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <Link
            href={`/country/${cca3.toLowerCase()}`}
            className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Flag Image Section with Graceful Fallback */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-b border-[#e2d5b5]/80 dark:border-slate-800">
        <CountryFlagImage
          src={flags.png || flags.svg}
          alt={flags.alt || `${name.common} Flag`}
          cca2={cca2}
          cca3={cca3}
          countryName={name.common}
          flagEmoji={flag}
          priority={false}
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
        />

        {/* CCA3 & Region Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-slate-900/85 backdrop-blur-xs text-white border border-slate-700/60 shadow-xs">
            {cca3}
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-blue-600 text-white shadow-xs">
            {region}
          </span>
        </div>

        {/* Action icons on top right */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            onClick={() => onToggleFavorite(country)}
            aria-label="Favorite country"
            className={`p-1.5 rounded-md backdrop-blur-xs transition-colors cursor-pointer shadow-xs ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-slate-900/75 text-white hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => onToggleCompare(country)}
            aria-label="Compare country"
            className={`p-1.5 rounded-md backdrop-blur-xs transition-colors cursor-pointer shadow-xs ${
              isCompared
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900/75 text-white hover:bg-slate-900'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            href={`/country/${cca3.toLowerCase()}`}
            className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block leading-snug"
            title={name.common}
          >
            {name.common}
          </Link>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
            {name.official}
          </p>
        </div>

        {/* Key Demographics */}
        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-md border border-[#e2d5b5]/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Users className="w-3 h-3 text-blue-500 flex-shrink-0" />
              <span>Population:</span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {formattedPop}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>Capital:</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[55%] text-right">
              {capitalName}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Globe className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              <span>Area:</span>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formattedArea}
            </span>
          </div>
        </div>

        {/* Subregion / Status Tags */}
        <div className="flex items-center justify-between pt-0.5 text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 truncate max-w-[60%] font-medium">
            {subregion || region}
          </span>
          <span
            className={`font-semibold px-1.5 py-0.2 rounded-md text-[10px] ${
              independent
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {independent ? 'Independent' : 'Dependent'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 pt-1">
          <Link
            href={`/country/${cca3.toLowerCase()}`}
            className="flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            Explore Nation
          </Link>
          {maps?.googleMaps && (
            <a
              href={maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Maps"
              className="p-1.5 rounded-md border border-[#e2d5b5] dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
