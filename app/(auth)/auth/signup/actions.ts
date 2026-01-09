"use server";

import { signIn } from "@/lib/auth/auth";
import axiosdb from "@/lib/axios";

export async function handleSignup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  // const acceptTerms = !!formData.get("acceptTerms");
  const role = "client";

  if (!name || !email || !phone || !password) {
    return { error: "Veuillez remplir tous les champs" };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas" };
  }

  // if (!acceptTerms) {
  //   return { error: "Veuillez accepter les conditions d'utilisation" };
  // }
  try
  {
    const res = await axiosdb.post("/auth/register",{
      name,
      email,
      phone,
      password,
      role
    })

    if(res.status !== 201){
      return { error: "Une erreur est survenue lors de la création du compte : "+res.data.message };
    }

    // Auto login
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      return { error: result.error };
    }
  }catch(e) {
    return { error: "Une erreur est survenue lors de la création du compte : ", e };
  }

  return {
    success: true,
    redirectUrl: `/dashboard/${role}`,
  }
}
