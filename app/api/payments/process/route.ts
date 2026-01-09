"use server"
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole, errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    await requireRole(['admin', 'worker']);

    const body = await request.json();
    const {
      appointmentId,
      clientId,
      items,
      paymentMethod,
      discountCode,
      loyaltyPointsUsed = 0,
      tip = 0,
    } = body;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    let discount = 0;
    if (discountCode) {
      const code = await prisma.discountCode.findUnique({
        where: { code: discountCode, isActive: true },
      });

      if (code && code.usedCount < (code.maxUses || Infinity)) {
        discount = code.type === 'percentage' 
          ? (subtotal * Number(code.value)) / 100
          : Number(code.value);
      }
    }

    // Loyalty points discount (1 point = 100 CDF)
    const loyaltyDiscount = loyaltyPointsUsed * 100;
    discount += loyaltyDiscount;

    const total = subtotal - discount + tip;

    // Generate receipt number
    const receiptNumber = `BN-${Date.now()}-${nanoid(6)}`;

    // Create sale
    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          appointmentId,
          clientId,
          subtotal,
          discount,
          tip,
          total,
          paymentMethod,
          discountCode,
          loyaltyPointsUsed,
          receiptNumber,
          paymentStatus: 'completed',
          items: {
            create: items.map((item: any) => ({
              serviceId: item.serviceId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          payments: {
            create: {
              amount: total,
              method: paymentMethod,
              status: 'completed',
            },
          },
        },
        include: {
          items: {
            include: {
              service: true,
            },
          },
          payments: true,
        },
      });

      // Update client loyalty points
      if (loyaltyPointsUsed > 0) {
        await tx.clientProfile.update({
          where: { id: clientId },
          data: {
            loyaltyPoints: { decrement: loyaltyPointsUsed },
          },
        });

        await tx.loyaltyTransaction.create({
          data: {
            clientId,
            points: -loyaltyPointsUsed,
            type: 'redeemed_service',
            description: 'Points utilisés pour paiement',
            relatedId: newSale.id,
          },
        });
      }

      // Update discount code usage
      if (discountCode) {
        await tx.discountCode.update({
          where: { code: discountCode },
          data: { usedCount: { increment: 1 } },
        });
      }

      return newSale;
    });

    return successResponse({
      sale,
      receiptNumber,
      message: 'Paiement traité avec succès',
    }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}