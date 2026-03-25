"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest, 
  context: { params: Promise<{ id: string; }>; }
  ) {
    try {
      const id = (await context.params).id;
    await requireRole(['admin', 'worker']);

    const { searchParams } = new URL(request.url);
    const isAvailable = searchParams.get('isAvailable');

    const where: any = {};
    if (isAvailable !== null) {
      where.isAvailable = isAvailable === 'true';
    }

    const staff : any = await prisma.workerProfile.findUnique({
      where : {
        id,
        ...where,
      },
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
    });

    const daysMap = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    if (!staff) {
      throw new Error("Staff not found");
    }

    const completedApps = staff?.appointments || [];
    // const totalRevenue = completedApps.reduce((sum: any, app: any) => sum + (app.price || 0), 0);
    
    const uniqueClients = new Set(completedApps.map((a: any) => a.clientId)).size;
    const retention = completedApps.length > 0 
      ? Math.round((uniqueClients / completedApps.length) * 100) 
      : 0;

    const daysToWorks = staff.schedules.filter((sch: any) => sch.isAvailable).map((sch: any) => daysMap[sch.dayOfWeek]);

    const commissions = await prisma.commission.findMany({
      where: {
        workerId: id,
      },
    });

    const totalEarnings = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const totalBusiness = commissions.reduce((sum, c) => sum + c.businessEarnings, 0);
    const totalRevenue = commissions.reduce((sum, c) => sum + c.totalRevenue, 0);
    const formattedStaff = {
        id: staff?.id,
        userId: staff?.userId,
        position: staff?.position,
        specialties: staff?.specialties,
        commissionRate: staff?.commissionRate,
        rating: staff?.rating,
        totalReviews: staff?.totalReviews,
        isAvailable: staff?.isAvailable,
        workingHours: staff?.workingHours,
        hireDate: staff?.hireDate.toISOString(),
        createdAt: staff?.createdAt.toISOString(),
        updatedAt: staff?.updatedAt.toISOString(),
        totalSales: completedApps.length,
        totalEarnings,
        businessRevenue: totalBusiness,
        materialsReserve: totalRevenue * (5 / 100),
        operationalCosts: totalRevenue * (5 / 100),
        user: staff?.user,
        schedules: staff?.schedules.filter((sch: any) => sch.isAvailable),
        appointments: staff?.appointments,
        name: staff?.user.name,
        role: staff?.position,
        phone: staff?.user.phone,
        email: staff?.user.email,
        workingDays: daysToWorks,
        workingHoursString: typeof staff?.workingHours === 'string' ? staff?.workingHours : 'Non défini',
        appointmentsCount: completedApps.length,
        revenue: totalRevenue.toString(),
        clientRetention: `${retention}%`,
        upsellRate: `${Math.round(completedApps.filter((app: any) => app.price > 0).length / completedApps.length)}%`,
        commission: staff?.commissionRate,
        status: staff?.isAvailable ? 'active' : 'off',
      }

    return successResponse(formattedStaff);
  } catch (error) {
    return handleApiError(error);
  }
}