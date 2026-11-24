import { getAllCountries } from '@/lib/country-service';
import CountryExplorerClient from '@/components/CountryExplorerClient';

export default function HomePage() {
  const initialCountries = getAllCountries();
  return <CountryExplorerClient initialCountries={initialCountries} />;
}
