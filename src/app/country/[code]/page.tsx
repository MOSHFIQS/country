import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCountryByCode, getBorderCountries, getAllCountries } from '@/lib/country-service';
import CountryFlagImage from '@/components/CountryFlagImage';
import {
  ArrowLeft,
  MapPin,
  Users,
  Globe,
  Coins,
  Shield,
  ExternalLink,
  Compass,
} from 'lucide-react';

export async function generateStaticParams() {
  const countries = getAllCountries();
  return countries.map((c) => ({
    code: c.cca3.toLowerCase(),
  }));
}

export default async function CountryDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const country = getCountryByCode(code);

  if (!country) {
    notFound();
  }

  const borderNations = getBorderCountries(country.borders);

  const formattedPop = new Intl.NumberFormat('en-US').format(country.population);
  const formattedArea = country.area
    ? `${new Intl.NumberFormat('en-US').format(country.area)} km²`
    : 'N/A';

  const nativeNames = country.name.nativeName
    ? Object.values(country.name.nativeName)
        .map((n) => `${n.common} (${n.official})`)
        .slice(0, 3)
        .join(' • ')
    : 'N/A';

  const currencies = country.currencies
    ? Object.entries(country.currencies)
        .map(([cCode, val]) => `${val.name} (${val.symbol || cCode})`)
        .join(', ')
    : 'N/A';

  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A';

  const callingCode = country.idd?.root
    ? `${country.idd.root}${(country.idd.suffixes || []).slice(0, 2).join(', ')}`
    : 'N/A';

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-[100px] pt-4 sm:pt-6 space-y-4">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-900 border border-[#e2d5b5] dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explorer</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Flag & Emblem with Graceful Fallback */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-[3/2] w-full rounded-md overflow-hidden shadow-xs border border-[#e2d5b5] dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <CountryFlagImage
                src={country.flags.png || country.flags.svg}
                alt={country.flags.alt || `${country.name.common} Flag`}
                cca2={country.cca2}
                cca3={country.cca3}
                countryName={country.name.common}
                flagEmoji={country.flag}
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            {country.coatOfArms?.png && (
              <div className="flex items-center gap-2.5 p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-[#e2d5b5]/70 dark:border-slate-700">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src={country.coatOfArms.png}
                    alt={`${country.name.common} Coat of Arms`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    National Emblem
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {country.name.common}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-7 space-y-3">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-blue-600 text-white">
                  {country.cca3} ({country.cca2})
                </span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#e2d5b5]/50 dark:border-slate-700">
                  {country.region} • {country.subregion || 'N/A'}
                </span>
                {country.independent && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Sovereign State
                  </span>
                )}
                {country.unMember && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    UN Member
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {country.name.common}
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Official: {country.name.official}
              </p>
              {nativeNames !== 'N/A' && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Native: {nativeNames}
                </p>
              )}
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-[#e2d5b5]/60 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                  <Users className="w-3 h-3 text-blue-500" />
                  <span>Population</span>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formattedPop}
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-[#e2d5b5]/60 dark:border-slate-800">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                  <Globe className="w-3 h-3 text-emerald-500" />
                  <span>Land Area</span>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {formattedArea}
                </div>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-[#e2d5b5]/60 dark:border-slate-800 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>Capital City</span>
                </div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {(country.capital || []).join(', ') || 'N/A'}
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {country.maps?.googleMaps && (
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {country.maps?.openStreetMaps && (
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-[#e2d5b5] dark:border-slate-700 transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Geography */}
        <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Geography & Territory</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Continent</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {(country.continents || [country.region]).join(', ')}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Region / Subregion</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {country.region} ({country.subregion || 'N/A'})
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Coordinates</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {country.latlng ? `${country.latlng[0]}°, ${country.latlng[1]}°` : 'N/A'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Landlocked</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {country.landlocked ? 'Yes (No coastline)' : 'No (Coastal access)'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Top-Level Domain (TLD)</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {(country.tld || []).join(', ') || 'N/A'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Timezones</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
                {(country.timezones || []).slice(0, 3).join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Culture & Economy */}
        <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Economy, Society & Culture</span>
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Currencies</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
                {currencies}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Languages</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right max-w-[60%]">
                {languages}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Calling Code</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {callingCode}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Driving Side</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {country.car?.side ? `${country.car.side}-hand` : 'N/A'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">FIFA Code</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {country.fifa || 'N/A'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Start of Week</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {country.startOfWeek || 'Monday'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Neighboring Nations with Graceful Fallbacks */}
      <div className="bg-white dark:bg-slate-900 rounded-md border border-[#e2d5b5] dark:border-slate-800 p-4 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          <span>Bordering Nations ({borderNations.length})</span>
        </h3>

        {borderNations.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {borderNations.map((border) => (
              <Link
                key={border.cca3}
                href={`/country/${border.cca3.toLowerCase()}`}
                className="group p-2 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-[#e2d5b5] dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center gap-2"
              >
                <div className="relative w-7 h-4.5 rounded-xs overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700">
                  <CountryFlagImage
                    src={border.flags.png || border.flags.svg}
                    alt={border.name}
                    cca3={border.cca3}
                    countryName={border.name}
                    flagEmoji={border.flag}
                    sizes="30px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate block">
                    {border.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {border.cca3}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            This country is an island or has no shared land borders.
          </p>
        )}
      </div>
    </div>
  );
}
