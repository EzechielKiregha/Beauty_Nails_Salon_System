import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.formData();

  const phoneNumber = body.get("phoneNumber") as string;
  const text = (body.get("text") as string) || "";

  let response = "";

  const inputs = text.split("*");

  // STEP 0
  if (text === "") {
    response = `CON 💅 Beauty Nails
1. Payer un rendez-vous
2. Quitter`;
  }

  // STEP 1
  else if (text === "1") {
    // Get latest pending payment
    const payment = await prisma.paymentIntent.findFirst({
      where: {
        phoneNumber,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!payment) {
      response = `END ❌ Aucun paiement en attente`;
    } else {
      response = `CON Montant: ${payment.amount} RWF
Confirmer paiement?
1. Oui
2. Annuler`;
    }
    console.log("Current Response:", response);
  }

  // STEP 2 CONFIRM
  else if (text === "1*1") {
    const payment = await prisma.paymentIntent.findFirst({
      where: { phoneNumber, status: "pending" },
      orderBy: { createdAt: "desc" },
    });

    if (!payment) {
      response = `END ❌ Paiement introuvable`;
    } else {
      // Simulate payment success
      await prisma.paymentIntent.update({
        where: { id: payment.id },
        data: {
          status: "success",
          transactionId: `TX-${Date.now()}`,
        },
      });

      response = `END ✅ Paiement réussi!
Ref: TX-${Date.now()}`;
    }
    console.log("Current Response:", response);
  }

  else {
    response = `END Choix invalide`;
  }

  return new Response(response, {
    headers: { "Content-Type": "text/plain" },
  });
}