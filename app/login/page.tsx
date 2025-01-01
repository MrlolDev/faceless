"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Turnstile } from "@marsidev/react-turnstile";

import { SendOTP, VerifyOTP } from "./actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useTheme } from "next-themes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { toast } = useToast();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast({
        title: "Please complete the security check",
        description: "Verify that you are human before proceeding",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await SendOTP({ email, token: captchaToken });

      toast({
        title: "Check your email for the code!",
        description: "Enter the code to sign in",
      });
      setStep("otp");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error sending code",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTP = async (otp: string) => {
    console.log(otp);
    try {
      await VerifyOTP({ email, otp });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error verifying code",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading">Sign In</h1>
          <p className="mt-2 text-lg font-base">
            Enter your email to receive a code
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY! as string}
                onSuccess={(token: string) => setCaptchaToken(token)}
                onError={() => {
                  toast({
                    title: "Error with security check",
                    description: "Please try again or refresh the page",
                    variant: "destructive",
                  });
                }}
                className="mb-4"
              />
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </Button>
          </form>
        )}
        {step === "otp" && (
          <InputOTP maxLength={6} onComplete={handleOTP}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        )}
      </div>
    </div>
  );
}
