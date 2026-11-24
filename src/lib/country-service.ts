import countriesData from '@/data/countries.json';
import { Country, CountrySummary } from '@/types/country';

const allCountries: Country[] = countriesData as unknown as Country[];

// Index map for O(1) lookups by cca2, cca3, ccn3, name
const codeIndex = new Map<string, Country>();
const nameIndex = new Map<string, Country>();

allCountries.forEach((c) => {
  if (c.cca2) codeIndex.set(c.cca2.toUpperCase(), c);
  if (c.cca3) codeIndex.set(c.cca3.toUpperCase(), c);
  if (c.ccn3) codeIndex.set(c.ccn3, c);
  if (c.name?.common) nameIndex.set(c.name.common.toLowerCase(), c);
});

export interface CountryFilterOptions {
  query?: string;
  region?: string;
  subregion?: string;
  independent?: boolean;
  unMember?: boolean;
  landlocked?: boolean;
  sort?: 'name_asc' | 'name_desc' | 'pop_asc' | 'pop_desc' | 'area_asc' | 'area_desc';
  page?: number;
  limit?: number;
}

export function getAllCountries(): Country[] {
  return allCountries;
}

export function getCountryByCode(code: string): Country | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return codeIndex.get(upper) || nameIndex.get(code.trim().toLowerCase());
}

export function getBorderCountries(borderCodes: string[] = []): Array<{ cca3: string; name: string; flag: string; flags: Country['flags'] }> {
  return borderCodes
    .map((code) => {
      const country = codeIndex.get(code.toUpperCase());
      if (!country) return null;
      return {
        cca3: country.cca3,
        name: country.name.common,
        flag: country.flag || '',
        flags: country.flags,
      };
    })
    .filter((c): c is { cca3: string; name: string; flag: string; flags: Country['flags'] } => c !== null);
}

export function filterCountries(options: CountryFilterOptions) {
  const {
    query = '',
    region = '',
    subregion = '',
    independent,
    unMember,
    landlocked,
    sort = 'name_asc',
    page = 1,
    limit = 0, // 0 = no pagination
  } = options;

  let results = allCountries;

  // Search by query (common name, official name, native name, capital)
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    results = results.filter((c) => {
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

  // Region filter
  if (region && region !== 'all') {
    results = results.filter((c) => c.region.toLowerCase() === region.toLowerCase());
  }

  // Subregion filter
  if (subregion && subregion !== 'all') {
    results = results.filter((c) => c.subregion?.toLowerCase() === subregion.toLowerCase());
  }

  // Status flags
  if (typeof independent === 'boolean') {
    results = results.filter((c) => Boolean(c.independent) === independent);
  }
  if (typeof unMember === 'boolean') {
    results = results.filter((c) => Boolean(c.unMember) === unMember);
  }
  if (typeof landlocked === 'boolean') {
    results = results.filter((c) => Boolean(c.landlocked) === landlocked);
  }

  // Sorting
  results = [...results].sort((a, b) => {
    switch (sort) {
      case 'name_desc':
        return (b.name?.common || '').localeCompare(a.name?.common || '');
      case 'pop_asc':
        return (a.population || 0) - (b.population || 0);
      case 'pop_desc':
        return (b.population || 0) - (a.population || 0);
      case 'area_asc':
        return (a.area || 0) - (b.area || 0);
      case 'area_desc':
        return (b.area || 0) - (a.area || 0);
      case 'name_asc':
      default:
        return (a.name?.common || '').localeCompare(b.name?.common || '');
    }
  });

  const total = results.length;

  if (limit > 0) {
    const startIndex = (page - 1) * limit;
    results = results.slice(startIndex, startIndex + limit);
  }

  return {
    countries: results,
    total,
    page,
    totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
  };
}

export function getGlobalStats() {
  const total = allCountries.length;
  let totalPopulation = 0;
  let maxPopCountry = allCountries[0];
  let maxAreaCountry = allCountries[0];
  const regionCounts: Record<string, number> = {};
  let independentCount = 0;
  let unMemberCount = 0;

  for (const c of allCountries) {
    const pop = c.population || 0;
    const area = c.area || 0;
    totalPopulation += pop;

    if (pop > (maxPopCountry?.population || 0)) maxPopCountry = c;
    if (area > (maxAreaCountry?.area || 0)) maxAreaCountry = c;

    if (c.region) {
      regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
    }
    if (c.independent) independentCount++;
    if (c.unMember) unMemberCount++;
  }

  return {
    totalCountries: total,
    totalPopulation,
    independentCount,
    unMemberCount,
    largestByPopulation: {
      name: maxPopCountry?.name?.common,
      cca3: maxPopCountry?.cca3,
      population: maxPopCountry?.population,
      flag: maxPopCountry?.flags?.png,
    },
    largestByArea: {
      name: maxAreaCountry?.name?.common,
      cca3: maxAreaCountry?.cca3,
      area: maxAreaCountry?.area,
      flag: maxAreaCountry?.flags?.png,
    },
    regionCounts,
  };
}
