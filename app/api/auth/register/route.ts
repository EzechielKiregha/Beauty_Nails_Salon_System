import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { errorResponse, successResponse, handleApiError } from '@/lib/api/helpers';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = 'client' } = body;

    // Validation
    if (!name || !email || !phone || !password) {
      return errorResponse('Tous les champs sont requis', 400);
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return errorResponse('Email ou téléphone déjà utilisé', 409);
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        emailVerified: new Date(), // Auto-verify for now
        ...(role === 'client' && {
          clientProfile: {
            create: {
              referralCode: nanoid(8).toUpperCase(),
              tier: 'Regular',
            },
          },
        }),
      },
      include: {
        clientProfile: true,
        workerProfile: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      {
        user: userWithoutPassword,
        message: 'Compte créé avec succès',
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}