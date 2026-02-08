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

    // console.log('GET /appointments called with params:', { date, status, workerId, clientId, userId: user.id });

    // Validation
    if ( !clientId && user.role === 'client' ) {
      return errorResponse('Données manquantes', 400);
    }

    if (user.role === 'worker' && !workerId) {
      return errorResponse('Données manquantes pour les employés', 400);
    }

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
      where.date = { gte: new Date(date) };
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

    console.log('Final where clause for appointments query:', where);

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
      decidedToPayNow,
      paymentInfo = {},
    } = body;

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

    if (decidedToPayNow === "true" && paymentInfo) {

      const data = {
        discountCode: paymentInfo.discountCode ?? "No Discount Code",
        clientId, 
        notes: `Payment effectué pour le rendez-vous du ${appointment.date.toLocaleDateString("fr-FR")} à ${appointment.time}} par ${user.name}. Montant approuvé : $${paymentInfo.subtotal}, Montant payé : $${paymentInfo.total}`,
        appointmentId: appointment.id, 
        total: paymentInfo.total,
        subtotal: paymentInfo.subtotal,
        discount: paymentInfo.discount ?? 0,
        tax: paymentInfo.tax,
        tip: paymentInfo.tip,
        paymentMethod: paymentInfo.method,
        paymentStatus: paymentInfo.status,
        loyaltyPointsUsed: paymentInfo.loyaltyPointUsed,
        receiptNumber: paymentInfo.receipt,
      }

      const sale = await prisma.sale.create({
        data: data,
      });

      if (!sale) {
        throw new Error("Erreur lors de la création de la vente");
      }

      const saleItemData = {
        quantity: 1,
        price: service.price,
        appointmentId: appointment.id,
        discount: 0,
        service: { connect: { id: serviceId } },
        sale: { connect: { id: sale.id } },
      };

      await prisma.saleItem.create({
        data: saleItemData
      });

      await prisma.discountCode.update({
        where: { code: paymentInfo.discountCode },
        data: {
          usedCount: {
            increment: 1,
          },
        }
      });

      const loyaltyTransaction = await prisma.loyaltyTransaction.create({
        data: {
          clientId,
          points: 5,
          type: 'earned_appointment',
          description: `Bonus de reservation pour avoir reserver`,
        },
      });

      if (!loyaltyTransaction) {
        return errorResponse('Erreur lors du traitement du parrainage', 500);
      }
    }

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