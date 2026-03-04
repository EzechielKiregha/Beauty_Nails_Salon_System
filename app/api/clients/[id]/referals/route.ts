"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';


export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string; }>; }
) {
  try {
    const id = (await context.params).id;

    if (!id) return errorResponse("Invalid request");

    const referrals = await prisma.clientProfile.findUnique({
      where: {
        id
      },
      select: {
        referredBy: true,
        referralsRel: {
          select: {
            id: true,
            rewardGranted: true,
            status: true,
          },
          include: {
            referred: {
              select:{
                id: true,
                user:{
                  select:{
                    name:true,
                    email:true,
                    phone:true,
                  }
                },
                totalSpent: true,
                loyaltyPoints: true,
                totalAppointments: true,
                referralCode: true,
              }
            }
          }
        },

      }
    })

    return successResponse(referrals);
  } catch (error) {
    console.log(error);
    return handleApiError(error)
  }
}