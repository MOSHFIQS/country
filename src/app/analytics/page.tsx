'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Country } from '@/types/country';
import CountryFlagImage from '@/components/CountryFlagImage';
import { BarChart2, Users, Globe, ArrowLeft, Trophy } from 'lucide-react';

export default function AnalyticsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success) {
          setCountries(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const top10Population = useMemo(() => {
    return [...countries]
      .sort((a, b) => (b.population || 0) - (a.population || 0))
      .slice(0, 10);
  }, [countries]);

  const top10Area = useMemo(() => {
    return [...countries]
      .sort((a, b) => (b.area || 0) - (a.area || 0))
      .slice(0, 10);
  }, [countries]);

  const regionalBreakdown = useMemo(() => {
    const map: Record<string, { count: number; totalPop: number }> = {};
    countries.forEach((c) => {
      const reg = c.region || 'Other';
      if (!map[reg]) {
        map[reg] = { count: 0, totalPop: 0 };
      }
      map[reg].count++;
      map[reg].totalPop += c.population || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].totalPop - a[1].totalPop);
  }, [countries]);

  const maxPop = top10Population[0]?.population || 1;
  const maxArea = top10Area[0]?.area || 1;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explorer</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-blue-600" />
          <span>Global Demographics & Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Visual distribution of world population, territorial land mass, and continental statistics.
        </p>
      </div>

      {loading ? (
        <div className="h-80 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top 10 Population */}
            <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Top 10 Most Populous Nations</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">Population</span>
              </div>

              <div className="space-y-2.5">
                {top10Population.map((c, i) => {
                  const pct = Math.round((c.population / maxPop) * 100);
                  return (
                    <div key={c.cca3} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-slate-400 w-4 text-[11px]">{i + 1}.</span>
                          <div className="relative w-4.5 h-3 rounded-xs overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                            <CountryFlagImage
                              src={c.flags.png}
                              alt={c.name.common}
                              cca2={c.cca2}
                              cca3={c.cca3}
                              flagEmoji={c.flag}
                              sizes="20px"
                            />
                          </div>
                          <Link
                            href={`/country/${c.cca3.toLowerCase()}`}
                            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 truncate"
                          >
                            {c.name.common}
                          </Link>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {new Intl.NumberFormat('en-US').format(c.population)}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-md"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 10 Area */}
            <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Top 10 Largest Nations By Area</span>
                </h3>
                <span className="text-[11px] font-semibold text-slate-400">km²</span>
              </div>

              <div className="space-y-2.5">
                {top10Area.map((c, i) => {
                  const pct = Math.round(((c.area || 0) / maxArea) * 100);
                  return (
                    <div key={c.cca3} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-slate-400 w-4 text-[11px]">{i + 1}.</span>
                          <div className="relative w-4.5 h-3 rounded-xs overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                            <CountryFlagImage
                              src={c.flags.png}
                              alt={c.name.common}
                              cca2={c.cca2}
                              cca3={c.cca3}
                              flagEmoji={c.flag}
                              sizes="20px"
                            />
                          </div>
                          <Link
                            href={`/country/${c.cca3.toLowerCase()}`}
                            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 truncate"
                          >
                            {c.name.common}
                          </Link>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {new Intl.NumberFormat('en-US').format(c.area || 0)} km²
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-md"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Regional Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>Continental Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {regionalBreakdown.map(([region, data]) => (
                <div
                  key={region}
                  className="p-3 rounded-md bg-white dark:bg-slate-800 border border-[#e2d5b5] dark:border-slate-700 space-y-1"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    {region}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {(data.totalPop / 1_000_000).toFixed(1)}M
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{data.count} territories</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
