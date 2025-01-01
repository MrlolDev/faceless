"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import { SendOTP, VerifyOTP } from "./actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await SendOTP({ email });

      toast({
        title: "Check your email for the code!",
        description: "Please try again.",
      });
      setStep("otp");
    } catch (error) {
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
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
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
            </InputOTPGroup>{" "}
          </InputOTP>
        )}
      </div>
    </div>
  );
}
