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
      if (date) {
        where.date = { gte: new Date(date) };
      }

      if (status) {
        where.status = status;
      }

      if (clientId) {
        where.clientId = clientId;
      }
    } else if (user.role === 'worker' && !clientId && wId) {
      where.workerId = wId;
      if (date) {
        where.date = { gte: new Date(date) };
      }

      if (status) {
        where.status = status;
      }
    } else if (user.role === 'worker' && clientId && wId) {
      where.workerId = wId;
      if (date) {
        where.date = { gte: new Date(date) };
      }

      if (status) {
        where.status = status;
      }
      
      if (clientId) {
        where.clientId = clientId;
      }
    } 
    
    if ( (!date && !workerId && !clientId && !status) || user.role === 'admin') {
      // For admins, allow filtering by workerId or clientId if provided
      if (workerId) {
        where.workerId = workerId;
      }
      if (clientId) {
        where.clientId = clientId;
      }

      if (date) {
        where.date = { gte: new Date(date) };
      } else {
        where.date = { lte: new Date() }; // Default to future appointments if no date filter
      }

      if (status) {
        where.status = status;
      }
    }

    console.log('Constructed where clause for appointments query:', where);

    const appointments = await prisma.appointment.findMany({
      where: {
        ...where,
      },
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
      decidedToPay,
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
      return errorResponse('A cette date et heure, ce rendez-vous n\'est pas disponible', 409);
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

    const updateClient = await prisma.clientProfile.update({
      where: { id: clientId },
      data: {
        loyaltyPoints: {
          increment: service.price / 1000,
        },
        totalSpent: {
          increment: service.price,
        },
        loyaltyTransactions: {
          create: {
            points: service.price / 1000,
            type: 'earned_appointment',
            description: `Point Bonus pour avoir reserver`,
          },
        },
      },
      select : {
        userId: true
      }
    });

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
    if (decidedToPay) {

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
        receiptNumber: `RCT-${Date.now()}`,
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
        discount: sale.discount,
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

      // Create payment
      const payment = await prisma.payment.create({
        data: {
          amount: service.price,
          method: paymentInfo.method,
          status: 'pending',
          sale: { connect: { id: sale.id } }
        },
      });

      if(payment){
        // Create notification
        await prisma.notification.create({
          data: {
            userId: updateClient.userId,
            type: 'payment_received',
            title: 'Payement en attente d\'approbation',
            message: `Votre Payement est en attente  pour votre rendez-vous de ${service.name} le ${date} à ${time}`,
            link: `/dashboard/client?appointment=confirm&id=${appointment.id}`,
          },
        });
      }
    } else {

      // Create notification
      await prisma.notification.create({
        data: {
          userId: updateClient.userId,
          type: 'payment_received',
          title: 'Rappel au Payement',
          message: `Votre Payement pour votre rendez-vous de ${service.name} se reglera sur place le ${appointment.date.toLocaleDateString("fr-FR")} à ${time}`,
          link: `/dashboard/client?appointment=confirm&id=${appointment.id}`,
        },
      });
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