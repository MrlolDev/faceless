"use server";

import { createClient } from "@/lib/supabase/server";

export async function SendOTP({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const supabase = await createClient();

  const data = {
    email,
    options: {
      captchaToken: token,
    },
  };

  const { error } = await supabase.auth.signInWithOtp(data);

  if (error) {
    console.error(error);
    throw new Error("Failed to send OTP");
  }

  return true;
}

export async function VerifyOTP({
  email,
  otp,
  token,
}: {
  email: string;
  otp: string;
  token: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    token: otp,
    email,
    type: "email",
    options: {
      captchaToken: token,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to verify OTP");
  }

  return true;
}
