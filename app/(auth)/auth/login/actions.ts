"use server";

import { signIn } from "@/lib/auth/auth";

export async function handleLogin(formData: FormData, expectedRole: string, redirect?: string | null) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Email ou mot de passe incorrect" };
    }

    if (!redirect){
      return {
      success: true,
      redirectUrl: `/dashboard/${expectedRole}`,
    };
    } else {
      return {
      success: true,
      redirectUrl: `/${redirect}`,
    };
    }

  } catch (err: any) {
    return { error: "Incorrect Email or Password, verifier votre role et essayez encore une fois..." };
  }
}
