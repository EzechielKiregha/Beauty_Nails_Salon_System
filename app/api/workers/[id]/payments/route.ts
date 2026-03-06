import { NextRequest } from 'next/server';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // await requireRole(['admin', 'worker']); // Add auth if needed

    const { id } = params; // Worker ID

    // Assuming payments are tracked in the Commission model where status is 'paid'
    const paidCommissions = await prisma.commission.findMany({
      where: {
        workerId: id,
        status: 'paid',
      },
      orderBy: { paidAt: 'desc' }, // Order by payment date
    });

    const paymentHistory = paidCommissions.map((c: any) => ({
      id: c.id,
      period: c.period,
      amount: c.commissionAmount,
      totalRevenue: c.totalRevenue,
      commissionRate: c.commissionRate,
      appointmentsCount: c.appointmentsCount,
      paidAt: c.paidAt!.toISOString(), // Safe to assert non-null due to status filter
      createdAt: c.createdAt.toISOString(),
    }));

    return successResponse(paymentHistory);
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return handleApiError(error);
  }
}