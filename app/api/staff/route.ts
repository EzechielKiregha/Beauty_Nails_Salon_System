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