import { NextRequest, NextResponse } from 'next/server';
import { getCountryByCode, getBorderCountries } from '@/lib/country-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const country = getCountryByCode(code);

  if (!country) {
    return NextResponse.json(
      { success: false, message: `Country with code '${code}' not found` },
      { status: 404 }
    );
  }

  const borders = getBorderCountries(country.borders);

  return NextResponse.json(
    {
      success: true,
      data: {
        ...country,
        borderCountries: borders,
      },
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    }
  );
}
