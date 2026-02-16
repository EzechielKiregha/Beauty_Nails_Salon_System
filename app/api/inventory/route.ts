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

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin']);
    const body = await request.json();
    const {
      name,
      category,
      description,
      sku,
      minStock,
      unit,
      cost,
      supplier,
      status = 'good',
      initialStock,
      maxStock,
    } = body;

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        description,
        currentStock: initialStock || 0,
        minStock,
        maxStock,
        cost,
        sku,
        unit,
        supplier,
        status,
      },
    });
    return successResponse(newItem, 201);
  } catch (error) {
    return handleApiError(error);
  }
}