"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!from || !to) {
      return errorResponse('Dates requises', 400);
    }

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: new Date(from),
          lte: new Date(to),
        },
        paymentStatus: 'completed',
      },
      include: {
        items: {
          include: {
            service: true,
          },
        },
      },
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

    // Group by service category
    const breakdown: Record<string, number> = {};
    sales.forEach(async (sale) => {

      const saleItems = await prisma.saleItem.findMany({
        where: {
          saleId: sale.id,
        },
      })

      saleItems.forEach((item : any) => {
        const category = item.service.category;
        breakdown[category] = (breakdown[category] || 0) + Number(item.price) * item.quantity;
      });
    });

    return successResponse({
      totalRevenue,
      salesCount: sales.length,
      breakdown,
      period: { from, to },
    });
  } catch (error) {
    return handleApiError(error);
  }
}