import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleApiError } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const dateStr = searchParams.get('date');
    const timeStr = searchParams.get('time');

    const where: any = {
      isAvailable: true,
      user: { isActive: true },
    };

    if (category) {
      where.specialties = {
        has: category,
      };
    }

    const staff = await prisma.workerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        appointments: dateStr
          ? {
              where: {
                date: new Date(dateStr),
                status: {
                  in: ['confirmed', 'in_progress'],
                },
              },
              select: {
                time: true,
                duration: true,
              },
            }
          : false,
      },
    });

    // Filter out staff who have conflicting appointments
    const availableStaff = staff.filter((worker) => {
      if (!dateStr || !timeStr || !worker.appointments) return true;

      const requestedTime = timeStr;
      const hasConflict = worker.appointments.some((apt: any) => {
        // Check for time conflicts
        return apt.time === requestedTime;
      });

      return !hasConflict;
    });

    return successResponse(availableStaff);
  } catch (error) {
    return handleApiError(error);
  }
}