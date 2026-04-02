import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { errorResponse, successResponse } from "@/lib/api/helpers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      phoneNumber,
      amount,
      serviceId,
      workerId,
    } = body;

    if (!phoneNumber || !amount) {
      return errorResponse("Missing required fields: phoneNumber and amount");
    }

    // Optional: avoid duplicates (reuse latest pending)
    const existing = await prisma.paymentIntent.findFirst({
      where: {
        phoneNumber,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return successResponse({
        success: true,
        paymentIntent: existing,
        reused: true,
      })
    }

    // Create new intent
    const paymentIntent = await prisma.paymentIntent.create({
      data: {
        phoneNumber,
        amount,
        serviceId,
        workerId,
        status: "pending",
      },
    });

    return Response.json({
      success: true,
      paymentIntent,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}