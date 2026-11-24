export interface CountryName {
  common: string;
  official: string;
  nativeName?: Record<string, { official: string; common: string }>;
}

export interface CountryCurrency {
  name: string;
  symbol: string;
}

export interface CountryFlags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CountryCoatOfArms {
  png?: string;
  svg?: string;
}

export interface CountryMaps {
  googleMaps: string;
  openStreetMaps?: string;
}

export interface Country {
  name: CountryName;
  tld?: string[];
  cca2: string;
  ccn3?: string;
  cca3: string;
  cioc?: string;
  independent?: boolean;
  status?: string;
  unMember?: boolean;
  currencies?: Record<string, CountryCurrency>;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  capital?: string[];
  altSpellings?: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  translations?: Record<string, { official: string; common: string }>;
  latlng?: [number, number];
  landlocked?: boolean;
  borders?: string[];
  area?: number;
  demonyms?: Record<string, { f: string; m: string }>;
  flag?: string;
  maps: CountryMaps;
  population: number;
  gini?: Record<string, number>;
  fifa?: string;
  car?: {
    signs?: string[];
    side?: 'right' | 'left';
  };
  timezones?: string[];
  continents?: string[];
  flags: CountryFlags;
  coatOfArms?: CountryCoatOfArms;
  startOfWeek?: string;
  capitalInfo?: {
    latlng?: [number, number];
  };
  postalCode?: {
    format?: string;
    regex?: string;
  };
}

export interface CountrySummary {
  cca2: string;
  cca3: string;
  name: CountryName;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  flags: CountryFlags;
  independent?: boolean;
  unMember?: boolean;
  landlocked?: boolean;
  currencies?: Record<string, CountryCurrency>;
  languages?: Record<string, string>;
  maps: CountryMaps;
}
