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

    const workers = await prisma.workerProfile.findMany({ include: { user: true } });

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: range.from,
          lte: range.to,
        },
        status: 'completed',
      },
      include: { sale: true },
    });

    // aggregate per worker
    const map: Record<string, any> = {};
    let maxAppointments = 0;

    workers.forEach((w) => {
      map[w.id] = { name: w.user?.name || '—', appointments: 0, revenue: 0, utilization: 0 };
    });

    (appointments as any[]).forEach((a) => {
      const w = map[a.workerId] || (map[a.workerId] = { name: '—', appointments: 0, revenue: 0, utilization: 0 });
      w.appointments = (w.appointments || 0) + 1;
      w.revenue = (w.revenue || 0) + (a.sale?.total ? Number(a.sale.total) : 0);
      if (w.appointments > maxAppointments) maxAppointments = w.appointments;
    });

    const staff = Object.entries(map).map(([id, v]) => ({ id, ...v }));
    // compute utilization relative to max
    staff.forEach((s) => {
      s.utilization = maxAppointments ? Math.round((s.appointments / maxAppointments) * 100) : 0;
    });

    return successResponse({ staff });
  } catch (error) {
    return handleApiError(error);
  }
}
