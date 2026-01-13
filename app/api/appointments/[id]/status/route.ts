"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError } from '@/lib/api/helpers';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string; }>; }
) {
  try {
    const id = (await context.params).id;
    await requireRole(['admin', 'worker']);

    const body = await request.json();
    const { status } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        service: true,
      },
    });

    // If completed, add loyalty points
    if (status === 'completed') {
      await prisma.$transaction([
        // Update client profile
        prisma.clientProfile.update({
          where: { id: appointment.clientId },
          data: {
            totalAppointments: { increment: 1 },
            totalSpent: { increment: appointment.price },
            loyaltyPoints: { increment: 10 },
          },
        }),
        // Create loyalty transaction
        prisma.loyaltyTransaction.create({
          data: {
            clientId: appointment.clientId,
            points: 10,
            type: 'earned_appointment',
            description: `Points gagnés pour ${appointment.service.name}`,
            relatedId: appointment.id,
          },
        }),
        // Create notification
        prisma.notification.create({
          data: {
            userId: appointment.client.userId,
            type: 'loyalty_reward',
            title: 'Points de fidélité',
            message: 'Vous avez gagné 10 points de fidélité !',
          },
        }),
      ]);
    }

    return successResponse({
      message: 'Statut mis à jour',
      appointment,
    });
  } catch (error) {
    return handleApiError(error);
  }
}