"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

function parseRange(searchParams: URLSearchParams) {
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  if (!from || !to) return null;
  return { from: new Date(from), to: new Date(to) };
}

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const range = parseRange(searchParams);
    if (!range) return errorResponse('Dates requises', 400);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: range.from,
          lte: range.to,
        },
        status: 'completed',
      },
      select: { time: true },
    });

    const buckets: Record<string, number> = {};
    appointments.forEach((a) => {
      // time format "HH:MM" stored as string
      const hour = (a.time || '').slice(0,5);
      buckets[hour] = (buckets[hour] || 0) + 1;
    });

    const peakHours = Object.entries(buckets).map(([hour, bookings]) => ({ hour, bookings }));
    // sort by hour
    peakHours.sort((a, b) => a.hour.localeCompare(b.hour));

    return successResponse({ peakHours });
  } catch (error) {
    return handleApiError(error);
  }
}
