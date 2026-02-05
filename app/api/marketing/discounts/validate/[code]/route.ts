import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const discount = await prisma.discountCode.findUnique({
      where: { code: params.code },
    });

    if (!discount) {
      return NextResponse.json(
        { error: { message: 'Code promo invalide' } },
        { status: 404 }
      );
    }

    if (!discount.isActive) {
      return NextResponse.json(
        { error: { message: 'Ce code promo n\'est plus actif' } },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < discount.startDate) {
      return NextResponse.json(
        { error: { message: 'Ce code promo n\'est pas encore disponible' } },
        { status: 400 }
      );
    }

    if (now > discount.endDate) {
      return NextResponse.json(
        { error: { message: 'Ce code promo a expiré' } },
        { status: 400 }
      );
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json(
        { error: { message: 'Ce code promo a atteint sa limite d\'utilisation' } },
        { status: 400 }
      );
    }

    return NextResponse.json(discount);
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message || 'Validation failed' } },
      { status: 500 }
    );
  }
}
