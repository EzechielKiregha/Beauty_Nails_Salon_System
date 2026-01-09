"use server";

import { auth, getCurrentUser, signIn } from "@/lib/auth/auth";

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
      return { error: result.error };
    }
  } catch (err: any) {
    return { error: err?.message ?? "Une erreur inconnue" };
  }

  const user = await getCurrentUser()

  if (!user) {
    return { error: "Invalid session" };
  }

  const role = user?.role;

  if (role !== expectedRole) {
    return { error: "Unauthorized role" };
  }

  return {
    success: true,
    redirectUrl: `/dashboard/${role}`,
  }
}
