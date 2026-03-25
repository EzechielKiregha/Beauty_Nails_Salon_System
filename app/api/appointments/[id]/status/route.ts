"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, successResponse, handleApiError } from '@/lib/api/helpers';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
        worker: true,
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
            loyaltyPoints: { increment: 5 },
          },
        }),
        // Create loyalty transaction
        prisma.loyaltyTransaction.create({
          data: {
            clientId: appointment.clientId,
            points: 5,
            type: 'earned_appointment',
            description: `Points gagnés pour terminer le service ${appointment.service.name}`,
            relatedId: appointment.id,
          },
        }),
        // Create notification
        prisma.notification.create({
          data: {
            userId: appointment.client.userId,
            type: 'loyalty_reward',
            title: 'Points de fidélité',
            message: 'Vous avez gagné 5 points de fidélité !',
          },
        }),

        prisma.commission.create({
          data:{
            worker: { connect : { id: appointment.workerId }},
            appointmentsCount: 1,
            commissionAmount: appointment.price * appointment.service.workerCommission / 100,
            commissionRate: appointment.service?.workerCommission ?? 0,
            status: 'pending',
            totalRevenue: appointment.price,
            period: `${format(appointment.date, "yyyy-MM", { locale: fr })}`,
            businessEarnings: appointment.price - (appointment.price * appointment.service.workerCommission / 100)
          }
        })
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