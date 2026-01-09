"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'worker']);

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const isAvailable = searchParams.get('isAvailable');

    const where: any = {};
    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }

    const staff = await prisma.workerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
          },
        },
        schedules: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin']);

    const body = await request.json();
    const {
      userId,
      position,
      specialties,
      commissionRate,
      workingHours,
    } = body;

    const worker = await prisma.workerProfile.create({
      data: {
        userId,
        position,
        specialties,
        commissionRate,
        workingHours,
      },
      include: {
        user: true,
      },
    });

    return successResponse({
      message: 'Employé créé avec succès',
      worker,
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}