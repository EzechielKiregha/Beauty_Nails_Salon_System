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

    // total active membership purchases
    const totalMembers = await prisma.membershipPurchase.count({ where: { status: 'active' } });

    // counts by client tier
    const byTier = await prisma.clientProfile.groupBy({
      by: ['tier'],
      _count: { _all: true },
    }) as any[];

    const tierCounts: Record<string, number> = {};
    byTier.forEach((b) => {
      tierCounts[b.tier] = Number(b._count?._all || 0);
    });

    // revenue split: member vs non-member
    // find member client ids (have an active membership purchase)
    const members = await prisma.membershipPurchase.findMany({ where: { status: 'active' }, distinct: ['clientId'], select: { clientId: true } });
    const memberIds = members.map((m) => m.clientId);

    const salesWhere: any = { paymentStatus: 'completed' };
    if (range) salesWhere.createdAt = { gte: range.from, lte: range.to };

    const totalSales = await prisma.sale.findMany({ where: salesWhere, select: { total: true, clientId: true } });
    const totalRevenue = totalSales.reduce((s, r) => s + Number(r.total), 0);
    const memberRevenue = totalSales.filter((s) => memberIds.includes(s.clientId)).reduce((s, r) => s + Number(r.total), 0);
    const nonMemberRevenue = totalRevenue - memberRevenue;

    return successResponse({
      totalMembers,
      vip: tierCounts['VIP'] ?? 0,
      premium: tierCounts['Premium'] ?? 0,
      regular: tierCounts['Regular'] ?? 0,
      memberRevenue,
      nonMemberRevenue,
      averageMemberSpend: memberIds.length ? Math.round(memberRevenue / Math.max(1, memberIds.length)) : 0,
      averageNonMemberSpend: 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
