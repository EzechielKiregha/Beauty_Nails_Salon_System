"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(_request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    const client = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
      include: {
        referralsRel: {
          include: {
            referred: {
              include: {
                user: {
                  select: {
                    name: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!client) {
      return errorResponse('Client non trouvé', 404);
    }

    return successResponse({
      code: client.referralCode,
      referrals: client.referrals || client.referralsRel?.length || 0,
      referralList: client.referralsRel || [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}