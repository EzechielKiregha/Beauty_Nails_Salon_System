"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, successResponse, handleApiError, errorResponse } from '@/lib/api/helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const { searchParams } = new URL(request.url);

    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const workerId = searchParams.get('workerId');
    const clientId = searchParams.get('clientId');

    const where: any = {};

    // Role-based filtering
    if (user.role === 'client') {
      where.clientId = user.id;
    } else if (user.role === 'worker' && !clientId) {
      where.workerId = user.id;
    }

    if (date) {
      where.date = new Date(date);
    }

    if (status) {
      where.status = status;
    }

    if (workerId) {
      where.workerId = workerId;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
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
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    return successResponse(appointments);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();

    const {
      clientId,
      serviceId,
      workerId,
      date,
      time,
      location = 'salon',
      addOns = [],
      notes,
    } = body;

    // Validation
    if (!serviceId || !workerId || !date || !time) {
      return errorResponse('Données manquantes', 400);
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return errorResponse('Service non trouvé', 404);
    }

    // Check for conflicts
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        workerId,
        date: new Date(date),
        time,
        status: {
          in: ['confirmed', 'in_progress'],
        },
      },
    });

    if (conflictingAppointment) {
      return errorResponse('Ce créneau n\'est pas disponible', 409);
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: clientId || user.id,
        serviceId,
        workerId,
        date: new Date(date),
        time,
        duration: service.duration,
        price: service.price,
        location,
        addOns,
        notes,
        status: 'pending',
      },
      include: {
        client: {
          include: {
            user: true,
          },
        },
        service: true,
        worker: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: workerId,
        type: 'appointment_confirmed',
        title: 'Nouveau rendez-vous',
        message: `Nouveau rendez-vous pour ${service.name} le ${date} à ${time}`,
        link: `/dashboard/worker/appointments/${appointment.id}`,
      },
    });

    return successResponse(
      {
        appointment,
        message: 'Rendez-vous créé avec succès',
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}