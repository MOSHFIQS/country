import { NextResponse } from 'next/server';
import { getGlobalStats } from '@/lib/country-service';

export async function GET() {
  const stats = getGlobalStats();

  return NextResponse.json(
    {
      success: true,
      data: stats,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    }
  );
}
