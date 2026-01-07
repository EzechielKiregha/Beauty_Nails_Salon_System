import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    const client = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
      include: {
        referrals: {
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
      referrals: client.referrals.length,
      referralList: client.referrals,
    });
  } catch (error) {
    return handleApiError(error);
  }
}