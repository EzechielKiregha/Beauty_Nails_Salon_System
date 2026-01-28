import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = 'client', refCode } = body;

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
        }
    };

    let referrerID;

    if (refCode) {
      // Find referrer by referral code
      const referrer = await prisma.clientProfile.findUnique({
        where: { referralCode: refCode.toUpperCase() },
        include: { user: true },
      });
      if (!referrer) {
        return errorResponse('Code de parrainage invalide', 400);
      }
      dataClause.clientProfile.referredBy = referrer.user.name;
      referrerID = referrer.id;
    }

    // Create user with profile
    const user = await prisma.user.create({
      data: dataClause,
      include: {
        clientProfile: true,
        workerProfile: true,
      },
    });

    if (referrerID) {
      await prisma.referral.create({
        data: {
          referrerId: referrerID!,
          referredId: user.clientProfile!.id,
          status: 'completed',
          rewardGranted: true,
        },
      });
    }

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