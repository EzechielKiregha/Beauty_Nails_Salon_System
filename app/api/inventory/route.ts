"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'worker']);

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        _count: {
          select: {
            transactions: true,
            reorders: true,
          },
        },
      },
      orderBy: { currentStock: 'asc' },
    });

    return successResponse(items);
  } catch (error) {
    return handleApiError(error);
  }
}