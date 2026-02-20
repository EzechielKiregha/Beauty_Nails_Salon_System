"use server";

import { signIn } from "@/lib/auth/auth";

export async function handleLogin(formData: FormData, expectedRole: string) {
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

    return {
      success: true,
      redirectUrl: `/dashboard/${expectedRole}`,
    };

  } catch (err: any) {
    return { error: "Incorrect Email or Password, verifier votre role et essayez encore une fois..." };
  }
}
