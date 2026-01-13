"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string; }>; }
) {
  try {
    const user = await getAuthenticatedUser();
    const id = (await context.params).id;

    // Clients can only view their own profile
    if (user.role === 'client' && user.id !== id) {
      return errorResponse('Accès interdit', 403);
    }

    const client = await prisma.clientProfile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
        appointments: {
          include: {
            service: true,
            worker: {
              include: {
                user: {
                  select: {
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: { date: 'desc' },
          take: 10,
        },
        loyaltyTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        membershipPurchases: {
          where: { status: 'active' },
          include: {
            membership: true,
          },
        },
      },
    });

    if (!client) {
      return errorResponse('Client non trouvé', 404);
    }

    return successResponse(client);
  } catch (error) {
    return handleApiError(error);
  }
}