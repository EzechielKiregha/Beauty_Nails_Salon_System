"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError } from '@/lib/api/helpers';

function parseRange(searchParams: URLSearchParams) {
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  return from && to ? { from: new Date(from), to: new Date(to) } : null;
}

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const range = parseRange(searchParams);

    const where: any = {};
    if (range) where.sentDate = { gte: range.from, lte: range.to };

    const campaigns = await prisma.marketingCampaign.findMany({ where, orderBy: { sentDate: 'desc' } });

    // compute conversions and revenue for each campaign using a 7-day attribution window after sentDate
    const results = await Promise.all(campaigns.map(async (c) => {
      let conversions = 0;
      let revenue = 0;
      if (c.sentDate) {
        const start = c.sentDate;
        const end = new Date(c.sentDate);
        end.setDate(end.getDate() + 7);
        const sales = await prisma.sale.findMany({ where: { createdAt: { gte: start, lte: end }, paymentStatus: 'completed' }, select: { total: true } });
        conversions = sales.length;
        revenue = sales.reduce((s, r) => s + Number(r.total), 0);
      }
      return {
        id: c.id,
        name: c.name,
        recipients: c.recipients,
        openRate: c.openRate ?? 0,
        clickRate: c.clickRate ?? 0,
        scheduledDate: c.scheduledDate,
        sentDate: c.sentDate,
        status: c.status,
        conversions,
        revenue,
      };
    }));

    return successResponse({ campaigns: results });
  } catch (error) {
    return handleApiError(error);
  }
}
