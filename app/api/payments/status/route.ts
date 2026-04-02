import { successResponse } from "@/lib/api/helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  const payment = await prisma.paymentIntent.findFirst({
    where: {
      phoneNumber: phone!,
      status: "success",
    },
    orderBy: { createdAt: "desc" },
  });

  return successResponse({
    paid: !!payment,
    amount: payment?.amount || 0,
    transactionId: payment?.transactionId,
  });
}