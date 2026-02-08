import { NextRequest } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';
import { nanoid } from 'nanoid';
import { toUserDTO } from '@/lib/dto/user.dto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { name, email, phone, password, role = 'client', refCode } = body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    }); 

    if (existingUser) {
      return errorResponse('Email ou téléphone déjà utilisé', 409);
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
      dataClause.clientProfile.create.referredBy = referrer.user.name;
      referrerID = referrer.id;
    }

    // Create user with profile
    const user = await prisma.user.create({
      data: dataClause,
      include:{
        clientProfile: true,
        workerProfile: true
      }
    });

    if (user && referrerID) {
      const referral = await prisma.referral.create({
        data: {
          referrerId: referrerID!,
          referredId: user.clientProfile!.id,
          status: 'pending',
          rewardGranted: false,
        },
      });

      // Optionally, update referrer's loyalty points or tier here
      const referrerProfile = await prisma.clientProfile.update({
        where: { id: referrerID },
        data: {
          loyaltyPoints: { increment: 5 },
          referrals: { increment: 1 },
        },
      });

      const loyaltyTransaction = await prisma.loyaltyTransaction.create({
        data: {
          clientId: referrerID,
          points: 5,
          type: 'earned_referral',
          description: `Bonus de parrainage pour avoir référé ${name}`,
        },
      });

      if (!referral || !referrerProfile || !loyaltyTransaction) {
        return errorResponse('Erreur lors du traitement du parrainage', 500);
      }

      if (referrerProfile.loyaltyPoints >= 500 && referrerProfile.tier === 'Regular') {
        await prisma.clientProfile.update({
          where: { id: referrerID },
          data: { tier: 'VIP', },
        });
      }
    }

    return successResponse(
      {
        user: toUserDTO(user),
        message: "Compte créé avec succès"
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}