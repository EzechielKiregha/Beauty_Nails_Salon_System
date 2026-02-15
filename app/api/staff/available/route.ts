"use server"
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
            email: true,
            phone: true,
            avatar: true,
            isActive: true,
          },
        },
        schedules: true,
        appointments: {
          where: {
            status: 'completed',
          },
          select: {
            price: true,
            clientId: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Filter out staff who have conflicting appointments
    const availableStaff = staff.filter(async (worker) => {

      const workerAppointments = await prisma.appointment.findMany({
        where: {
          workerId: worker.id,
          date: dateStr ? new Date(dateStr) : undefined,
          status: {
            in: ['confirmed', 'in_progress'],
          },
      }})

      if (!dateStr || !timeStr ) return true;

      const requestedTime = timeStr;
      const hasConflict = workerAppointments.some((apt: any) => {
        // Check for time conflicts
        return apt.time === requestedTime;
      });

      return !hasConflict;
    });
    
    const daysMap = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const formattedStaff = availableStaff.map((s: any) => {
      const completedApps = s.appointments || [];
      const totalRevenue = completedApps.reduce((sum: any, app: any) => sum + (app.price || 0), 0);
      
      const uniqueClients = new Set(completedApps.map((a: any) => a.clientId)).size;
      const retention = completedApps.length > 0 
        ? Math.round((uniqueClients / completedApps.length) * 100) 
        : 0;

      return {
        id: s.id,
        userId: s.userId,
        position: s.position,
        specialties: s.specialties,
        commissionRate: s.commissionRate,
        rating: s.rating,
        totalReviews: s.totalReviews,
        isAvailable: s.isAvailable,
        workingHours: s.workingHours,
        hireDate: s.hireDate.toISOString(),
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        totalSales: completedApps.length,
        totalEarnings: totalRevenue * (s.commissionRate < 45 ? s.commissionRate / 100 : 45 / 100),
        businessRevenue: totalRevenue * (45 / 100),
        materialsReserve: totalRevenue * (5 / 100),
        operationalCosts: totalRevenue * (5 / 100),
        user: s.user,
        schedules: s.schedules,
        appointments: s.appointments,
        name: s.user.name,
        role: s.position,
        phone: s.user.phone,
        email: s.user.email,
        workingDays: s.schedules.map((sch: any) => daysMap[sch.dayOfWeek]),
        workingHoursString: typeof s.workingHours === 'string' ? s.workingHours : 'Non défini',
        appointmentsCount: completedApps.length,
        revenue: totalRevenue.toString(),
        clientRetention: `${retention}%`,
        upsellRate: `${Math.round(completedApps.filter((app: any) => app.price > 0).length / completedApps.length)}%`,
        commission: s.commissionRate,
        status: s.isAvailable ? 'active' : 'off',
      };
    });

    return successResponse(formattedStaff);
  } catch (error) {
    return handleApiError(error);
  }
}