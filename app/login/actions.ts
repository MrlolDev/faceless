"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function SendOTP({ email }: { email: string }) {
  const supabase = await createClient();

  const data = {
    email,
    options: {
      shouldCreateUser: false,
    },
  };

  const { error } = await supabase.auth.signInWithOtp(data);

  if (error) {
    throw new Error("Failed to send OTP");
  }

  return true;
}

export async function VerifyOTP({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token: otp,
    email,
    type: "email",
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/app", "layout");
  redirect("/app");
}
