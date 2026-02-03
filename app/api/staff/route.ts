"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin', 'worker']);

    const { searchParams } = new URL(request.url);
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

    const daysMap = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const formattedStaff = staff.map((s: any) => {
      const completedApps = s.appointments || [];
      const totalRevenue = completedApps.reduce((sum:any, app:any) => sum + (app.price || 0), 0);
      
      const uniqueClients = new Set(completedApps.map((a: any) => a.clientId)).size;
      const retention = completedApps.length > 0 
        ? Math.round((uniqueClients / completedApps.length) * 100) 
        : 0;

      return {
        id: s.id,
        name: s.user.name,
        role: s.position,
        phone: s.user.phone,
        email: s.user.email,
        workingDays: s.schedules.map((sch:any) => daysMap[sch.dayOfWeek]),
        workingHours: typeof s.workingHours === 'string' ? s.workingHours : 'Non défini',
        appointments: completedApps.length,
        rating: s.rating,
        revenue: `${totalRevenue.toLocaleString()} Fc`,
        clientRetention: `${retention}%`,
        upsellRate: '0%',
        commission: `${s.commissionRate}%`,
        status: s.isAvailable ? 'active' : 'off',
      };
    });

    return successResponse(formattedStaff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin']);
    
    const body = await request.json();
      const { name, email, phone, password, role = 'worker', workerProfile: {
          position,
          specialties,
          commissionRate,
          workingHours,
        }
      } = body;
  
      // Validation
      if (!name || !email || !phone || !password) {
        return errorResponse('Tous les champs sont requis', 400);
      }
  
      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
        },
      });
  
      if (existingUser) {
        return successResponse('Email ou téléphone déjà utilisé', 202);
      }
  
      // Hash password
      const hashedPassword = await hash(password, 10);
      
      let dataClause: any = {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        emailVerified: new Date(),
        clientProfile: {
          create: {
            referralCode: nanoid(8).toUpperCase(),
            tier: 'Regular',
          },
        },
        workerProfile: {
          create: {
            position,
            specialties,
            commissionRate,
            workingHours,
          },
        }
      };
  
      // Create user with profile
      const user = await prisma.user.create({
        data: dataClause,
        include: {
          clientProfile: true,
          workerProfile: true,
        },
      });
  
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
  
      return successResponse(
        {
          user: userWithoutPassword,
          message: 'Compte créé avec succès',
        },
        201
      );
    } catch (error) {
      return handleApiError(error);
    }
}