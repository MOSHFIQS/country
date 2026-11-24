'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Country } from '@/types/country';
import CountryFlagImage from '@/components/CountryFlagImage';
import { Scale, X, ArrowLeft, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function ComparePage() {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [compared, setCompared] = useState<Country[]>([]);
  const [selectedAddCode, setSelectedAddCode] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/countries');
        const json = await res.json();
        if (json.success) {
          setAllCountries(json.data);
          const saved = JSON.parse(localStorage.getItem('compare_countries') || '[]');
          if (Array.isArray(saved) && saved.length > 0) {
            setCompared(saved);
          } else if (json.data.length >= 2) {
            const us = json.data.find((c: Country) => c.cca3 === 'USA');
            const bd = json.data.find((c: Country) => c.cca3 === 'BGD');
            const defaults = [bd, us].filter(Boolean) as Country[];
            setCompared(defaults);
            localStorage.setItem('compare_countries', JSON.stringify(defaults));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleRemove = (cca3: string) => {
    const updated = compared.filter((c) => c.cca3 !== cca3);
    setCompared(updated);
    localStorage.setItem('compare_countries', JSON.stringify(updated));
    window.dispatchEvent(new Event('compare_updated'));
  };

  const handleClear = () => {
    setCompared([]);
    localStorage.removeItem('compare_countries');
    window.dispatchEvent(new Event('compare_updated'));
  };

  const handleAddCountry = (cca3: string) => {
    if (!cca3) return;
    const found = allCountries.find((c) => c.cca3 === cca3);
    if (!found) return;
    if (compared.some((c) => c.cca3 === cca3)) return;
    if (compared.length >= 4) {
      alert('Maximum 4 countries can be compared.');
      return;
    }
    const updated = [...compared, found];
    setCompared(updated);
    localStorage.setItem('compare_countries', JSON.stringify(updated));
    setSelectedAddCode('');
    window.dispatchEvent(new Event('compare_updated'));
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      {/* Top Header */}
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
            <Scale className="w-6 h-6 text-blue-600" />
            <span>Country Comparison Matrix</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare demographics, geography, and indicators side-by-side (up to 4 countries).
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {compared.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {compared.length < 4 && (
            <select
              value={selectedAddCode}
              onChange={(e) => handleAddCountry(e.target.value)}
              className="px-2.5 py-1.5 rounded-md border border-[#e2d5b5] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">+ Add country to compare...</option>
              {allCountries
                .filter((c) => !compared.some((comp) => comp.cca3 === c.cca3))
                .sort((a, b) => a.name.common.localeCompare(b.name.common))
                .map((c) => (
                  <option key={c.cca3} value={c.cca3}>
                    {c.name.common} ({c.cca3})
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {compared.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 space-y-3">
          <Scale className="w-10 h-10 mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No countries selected for comparison
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select countries from the dropdown above or click the scale icon on any card in the explorer.
          </p>
          <Link
            href="/"
            className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white"
          >
            Explore Countries
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-[#e2d5b5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-[#e2d5b5] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                <th className="p-3 w-40 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Indicator
                </th>
                {compared.map((c) => (
                  <th key={c.cca3} className="p-3 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-5 rounded-xs overflow-hidden border border-[#e2d5b5] dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                          <CountryFlagImage
                            src={c.flags.png || c.flags.svg}
                            alt={c.name.common}
                            cca2={c.cca2}
                            cca3={c.cca3}
                            flagEmoji={c.flag}
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/country/${c.cca3.toLowerCase()}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 font-bold block"
                          >
                            {c.name.common}
                          </Link>
                          <span className="text-[10px] font-mono text-slate-400">
                            {c.cca3}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(c.cca3)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Population
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {new Intl.NumberFormat('en-US').format(c.population)}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Land Area
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {c.area ? `${new Intl.NumberFormat('en-US').format(c.area)} km²` : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Capital
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {(c.capital || []).join(', ') || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Region & Subregion
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {c.region} • {c.subregion || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Sovereignty
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 font-medium">
                    {c.independent ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <XCircle className="w-3.5 h-3.5" /> Dependent
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  UN Member
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 font-medium">
                    {c.unMember ? (
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Member
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <XCircle className="w-3.5 h-3.5" /> Non-Member
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Currencies
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {c.currencies
                      ? Object.values(c.currencies)
                          .map((curr) => `${curr.name} (${curr.symbol || ''})`)
                          .join(', ')
                      : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Languages
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {c.languages ? Object.values(c.languages).join(', ') : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                  Bordering Nations
                </td>
                {compared.map((c) => (
                  <td key={c.cca3} className="p-3 text-slate-800 dark:text-slate-200 font-medium">
                    {c.borders && c.borders.length > 0
                      ? `${c.borders.length} (${c.borders.join(', ')})`
                      : 'Island / None'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
