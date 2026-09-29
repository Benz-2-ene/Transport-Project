import { NextRequest, NextResponse } from 'next/server';
import { quoteFare } from '../../../lib/pricing';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const distanceKm = Number(body.distanceKm);
  const durationMinutes = Number(body.durationMinutes);
  if (!Number.isFinite(distanceKm) || !Number.isFinite(durationMinutes) || distanceKm <= 0 || durationMinutes <= 0) {
    return NextResponse.json({ error: 'A valid distance and duration are required.' }, { status: 422 });
  }
  const quote = quoteFare({ distanceKm, durationMinutes, category: body.category ?? 'economy', surgeMultiplier: Number(body.surgeMultiplier ?? 1) });
  return NextResponse.json(quote, { headers: { 'Cache-Control': 'no-store' } });
}
