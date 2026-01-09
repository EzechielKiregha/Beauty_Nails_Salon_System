"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';

export async function DELETE(
  request: NextRequest,
  params : Promise<{ params: { id: string } }>
) {
  try {
    const id = (await params).params.id;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const { reason } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id},
    });

    if (!appointment) {
      return errorResponse('Rendez-vous non trouvé', 404);
    }

    // Clients can only cancel their own appointments
    if (user.role === 'client' && appointment.clientId !== user.id) {
      return errorResponse('Accès interdit', 403);
    }

    const updated = await prisma.appointment.update({
      where: { id},
      data: {
        status: 'cancelled',
        cancelReason: reason,
      },
    });

    // Send notification to worker
    await prisma.notification.create({
      data: {
        userId: appointment.workerId,
        type: 'appointment_cancelled',
        title: 'Rendez-vous annulé',
        message: `Un rendez-vous a été annulé. Raison: ${reason}`,
        link: `/dashboard/worker/appointments`,
      },
    });

    return successResponse({
      message: 'Rendez-vous annulé',
      appointment: updated,
    });
  } catch (error) {
    return handleApiError(error);
  }
}