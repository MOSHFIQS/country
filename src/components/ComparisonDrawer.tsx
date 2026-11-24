'use client';

import Link from 'next/link';
import { Country } from '@/types/country';
import CountryFlagImage from './CountryFlagImage';
import { Scale, X, ArrowRight } from 'lucide-react';

interface ComparisonDrawerProps {
  comparedCountries: Country[];
  onRemove: (cca3: string) => void;
  onClear: () => void;
}

export default function ComparisonDrawer({
  comparedCountries,
  onRemove,
  onClear,
}: ComparisonDrawerProps) {
  if (comparedCountries.length === 0) return null;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-2xl bg-white dark:bg-slate-900 border border-blue-600 rounded-md shadow-xl p-2.5 sm:p-3 animate-slide-up">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({comparedCountries.length}/4):</span>
          </div>

          <div className="flex items-center gap-1.5">
            {comparedCountries.map((c) => (
              <div
                key={c.cca3}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-[#e2d5b5] dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <div className="relative w-4.5 h-3 rounded-xs overflow-hidden flex-shrink-0">
                  <CountryFlagImage
                    src={c.flags.png || c.flags.svg}
                    alt={c.name.common}
                    cca2={c.cca2}
                    cca3={c.cca3}
                    flagEmoji={c.flag}
                    sizes="20px"
                  />
                </div>
                <span className="text-[11px]">{c.cca3}</span>
                <button
                  onClick={() => onRemove(c.cca3)}
                  className="text-slate-400 hover:text-rose-500 transition-colors ml-0.5 cursor-pointer"
                  aria-label={`Remove ${c.name.common}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onClear}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold px-2 py-1 cursor-pointer"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
          >
            <span>Compare</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
