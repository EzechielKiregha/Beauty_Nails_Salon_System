import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();

    const client = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
      include: {
        loyaltyTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!client) {
      return errorResponse('Client non trouvé', 404);
    }

    return successResponse({
      points: client.loyaltyPoints,
      tier: client.tier,
      transactions: client.loyaltyTransactions,
    });
  } catch (error) {
    return handleApiError(error);
  }
}