"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await context.params).id;
    await requireRole(['admin', 'worker']);

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'weekly';

    // Get worker profile
    const worker = await prisma.workerProfile.findUnique({
      where: { id },
    });

    if (!worker) {
      return errorResponse('Employé non trouvé', 404);
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    if (period === 'weekly') {
      startDate.setDate(now.getDate() - now.getDay()); // Start of current week
    } else if (period === 'monthly') {
      startDate.setDate(1); // Start of current month
    } else if (period === 'daily') {
      startDate.setDate(now.getDate()); // Start of today
    }

    // Get completed appointments in the period
    const appointments = await prisma.appointment.findMany({
      where: {
        workerId: id,
        status: 'completed',
        date: {
          gte: startDate,
          // lte: now,
        },
      },
    });


    const totalR = await prisma.appointment.aggregate({
      where: {
        workerId: id,
        status: 'completed',
        date: {
          gte: startDate,
          // lte: now,
        },
      },
      _sum: {
        price: true,
      },
    });

    // Calculate totals
    const totalRevenue = totalR._sum.price || 0;
    // CommissionRate is stored as 0-100 (e.g., 10 for 10%), so divide by 100 for calculation
    const commissionRate = (worker.commissionRate || 10) / 100;
    const commission = totalRevenue * commissionRate;
    const appointmentsCount = appointments.length;

    return successResponse({
      commission,
      totalRevenue,
      appointmentsCount,
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
