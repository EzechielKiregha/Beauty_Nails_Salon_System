// src/app/api/media/upload/route.ts

import { errorResponse, handleApiError, successResponse } from '@/lib/api/helpers';
import { requireRole } from '@/lib/auth/auth';
import prisma from '@/lib/prisma';
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {

  try {
    requireRole(["admin","client", "worker"])

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const body = await request.json();
  const {
    file,
    workerId,
    appointmentId,
    clientId
  } = body

  if (!file) errorResponse("un fichier manque");

  const blobToken = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

  const blob = await put(`business/medias/${Date.now()}-${filename!}`, file, {
    access: 'public',
    token: blobToken
  });

  // detect type
  let type: "IMAGE" | "VIDEO" | "DOCUMENT" = "DOCUMENT";
  if (blob.contentType?.startsWith("image")) type = "IMAGE";
  else if (blob.contentType?.startsWith("video")) type = "VIDEO";

  const media = await prisma.media.create({
    data: {
      name: filename!,
      appointmentId: appointmentId ? appointmentId : '',
      clientId: clientId ? clientId : '',
      workerId: workerId ? workerId : '', 
      url: blob.url,
      type,
      mimeType: blob.contentType,
    },
  });

  return NextResponse.json(media);
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest){
  
  try {
    requireRole(["admin","client", "worker"])

    const medias = await prisma.media.findMany()

    return successResponse(medias)
  } catch (error) {
    return handleApiError(error)
  }
}