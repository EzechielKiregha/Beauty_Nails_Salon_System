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

    console.log('GET /appointments called with params:', { date, status, workerId, clientId, userId: user.id });


    // Validation
    // if ( !workerId || !date || (!clientId && user.role !== 'client')) {
    //   return errorResponse('Données manquantes', 400);
    // }

    const where: any = {};
    let wId = workerId;

    if (workerId && user.role === 'worker') {
    const w = await prisma.workerProfile.findUnique({
      where: { userId: user.id },
      });

      if (!w) {
        return errorResponse('Employé non trouvé pour la notification', 404);
      }

      wId = w.id;
    }

    // Role-based filtering
    if (user.role === 'client') {
      where.clientId = clientId || user.clientProfile?.id;
    } else if (user.role === 'worker' && !clientId) {
      where.workerId = wId;
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
    let clientId = user.clientProfile?.id;

    const {
      serviceId,
      workerId,
      date,
      time,
      location = 'salon',
      addOns = [],
      notes,
    } = body;

    console.log('Received appointment data: ', body);
    console.log('Authenticated user: ', user);

    // If user is not a client, find clientId from their profile
    if (user.role !== 'client') {
      return errorResponse('Seuls les clients peuvent créer des rendez-vous', 403);
    }

    const client = await prisma.clientProfile.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return errorResponse('Client non trouvé', 404);
    }
    clientId = client.id;

    // Validation
    if (!serviceId || !workerId || !date || !time || !clientId) {
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
        clientId,
        serviceId,
        workerId: workerId,
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

    let wId = workerId;

    const workerUser = await prisma.user.findUnique({
      where: { id: workerId },
      select: {
        workerProfile: { select: { id: true } }
      }
    });

    if (!workerUser?.workerProfile) {
      const w = await prisma.workerProfile.findUnique({
      where: { id: workerId },
        include: {
          user: true,
        },
      });

      if (!w) {
        return errorResponse('Employé non trouvé pour la notification', 404);
      }

      wId = w.user.id;
    }

    console.log('Creating notification for user:', wId);

    // Create notification
    await prisma.notification.create({
      data: {
        userId: wId,
        type: 'appointment_confirmed',
        title: 'Nouveau rendez-vous',
        message: `Nouveau rendez-vous pour ${service.name} le ${date} à ${time}`,
        link: `/dashboard/worker/appointments?id=${appointment.id}`,
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