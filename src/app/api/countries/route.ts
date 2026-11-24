import { NextRequest, NextResponse } from 'next/server';
import { filterCountries, getAllCountries } from '@/lib/country-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('search') || searchParams.get('q') || '';
  const region = searchParams.get('region') || '';
  const subregion = searchParams.get('subregion') || '';
  const sort = (searchParams.get('sort') || 'name_asc') as any;
  const independentParam = searchParams.get('independent');
  const unMemberParam = searchParams.get('unMember');
  const landlockedParam = searchParams.get('landlocked');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '0', 10);

  const independent = independentParam !== null ? independentParam === 'true' : undefined;
  const unMember = unMemberParam !== null ? unMemberParam === 'true' : undefined;
  const landlocked = landlockedParam !== null ? landlockedParam === 'true' : undefined;

  const result = filterCountries({
    query,
    region,
    subregion,
    sort,
    independent,
    unMember,
    landlocked,
    page,
    limit,
  });

  return NextResponse.json(
    {
      success: true,
      timestamp: Date.now(),
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      data: result.countries,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    }
  );
}
