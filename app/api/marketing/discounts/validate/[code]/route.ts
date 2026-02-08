import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse } from '@/lib/api/helpers';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const discount = await prisma.discountCode.findUnique({
      where: { code: params.code },
    });

    if (!discount) {
      return errorResponse(
        "Code promo invalide"
      );
    }

    if (!discount.isActive) {
      return errorResponse('Ce code promo n\'est plus actif');
    }

    const now = new Date();
    if (now < discount.startDate) {
      return errorResponse('Ce code promo n\'est pas encore disponible');
    }

    if (now > discount.endDate) {
      return errorResponse('Ce code promo a expiré');
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return errorResponse('Ce code promo a atteint sa limite d\'utilisation');
    }

    return successResponse(discount, 200);
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message || 'Validation failed' } },
      { status: 500 }
    );
  }
}
