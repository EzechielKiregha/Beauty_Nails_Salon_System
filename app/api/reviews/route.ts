import { errorResponse, getAuthenticatedUser, handleApiError, requireRole, successResponse } from "@/lib/api/helpers";
import prisma from "@/lib/prisma";
import { Review } from "@/prisma/generated/client";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
){
  try {

  const body = await request.json();

  const {
    appointmentId,
    rating,
    comment = '',
  } = body

  console.log(body)

  if (!rating || !appointmentId ) return errorResponse('something went wrong!')

  const appointment = await prisma.appointment.findUnique({
    where: {
      id : appointmentId,
      status: 'completed'
    },
  });

  if (!appointment) return errorResponse("Echec de noter ce service")


  const review = await prisma.review.create({
    data: {
      appointment: { connect : { id : appointment.id}},
      client: { connect : { id : appointment.clientId} },
      worker: { connect : { id : appointment.workerId}},
      rating,
      comment,
      isPublished: false,
    }
  })

  const workerReviews = await prisma.review.findMany({
    where:{
      clientId : review.clientId
    }
  })
  if (workerReviews.length > 0) {
    const stars = workerReviews.reduce((sumOfStars, rev) => sumOfStars + rev.rating ,0)
    const ratings = stars / workerReviews.length

    await prisma.workerProfile.update({
      where: { id : review.clientId},
      data: {
        rating: ratings,
        totalReviews: workerReviews.length
      }
    })
  }

  return successResponse(review);
  }

  catch (error: any) {
    console.error('Error rating the appointment:', error);
    return errorResponse(error.message || 'An error occurred while rescheduling', 500);
  }
}

export async function GET(request: NextRequest){
  try {

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get('workerId');
    const clientId = searchParams.get('clientId');

    requireRole(["admin","client","worker"])

    let reviews = await prisma.review.findMany({
      cacheStrategy:{
        ttl: 60
      }
    })

    if (clientId) {
      reviews = await prisma.review.findMany({
        where:{
          clientId
        },
        cacheStrategy:{
          ttl: 60
        }
      })
    } else if (workerId){
      reviews = await prisma.review.findMany({
        where:{
          workerId
        },
        cacheStrategy:{
          ttl: 60
        }
      })
    }

    console.log(reviews)

    return successResponse({
      message: 'Merci pour votre avis !',
      reviews
    });

  } catch (error) {
    return handleApiError(error)
  }
}
