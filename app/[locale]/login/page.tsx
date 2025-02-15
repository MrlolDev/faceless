"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { SendOTP, VerifyOTP } from "./actions";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "loading">("email");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const turnstileRef2 = useRef<TurnstileInstance>(null);
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [otpAttempts, setOtpAttempts] = useState(0);
  const router = useRouter();
  const t = useTranslations("login");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast({
        title: t("invalidEmail"),
        description: t("enterValidEmail"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: t("acceptTerms"),
        description: t("acceptTermsDescription"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      return;
    }

    if (!captchaToken) {
      toast({
        title: t("securityCheck"),
        description: t("verifyHuman"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      return;
    }

    setLoading(true);

    try {
      await SendOTP({ email, token: captchaToken });

      toast({
        title: t("checkEmail"),
        description: t("enterCode"),
      });
      setStep("otp");
    } catch (error) {
      console.error(error);
      toast({
        title: t("errorSendingCode"),
        description: t("tryAgain"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleOTP = async (otp: string) => {
    setLoading(true);
    if (otpAttempts > 3) {
      toast({
        title: t("tooManyAttempts"),
        description: t("tryAgainLater"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      turnstileRef2.current?.reset();
      return;
    }
    setOtpAttempts(otpAttempts + 1);
    try {
      await VerifyOTP({ email, otp, token: captchaToken! });
      setStep("loading");
      router.push("/app");
      toast({
        title: t("success"),
        description: t("signedIn"),
      });
      turnstileRef.current?.reset();
      turnstileRef2.current?.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: t("errorVerifyingCode"),
        description: t("tryAgain"),
        variant: "destructive",
      });
      turnstileRef.current?.reset();
      turnstileRef2.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  if (step === "loading") {
    return <Loading fullScreen={true} element="session" size="large" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading">{t("signIn")}</h1>
          <p className="mt-2 text-lg font-base">{t("enterEmail")}</p>
        </div>

        {step === "email" && (
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t("agreeTo")}{" "}
                <Link
                  href="/terms"
                  className="underline hover:opacity-90 text-main"
                >
                  {t("termsOfService")}
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline hover:opacity-90 text-main"
                >
                  {t("privacyPolicy")}
                </Link>
              </label>
            </div>
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY! as string}
                onSuccess={(token: string) => setCaptchaToken(token)}
                onError={() => {
                  toast({
                    title: "Error with security check",
                    description: "Please try again or refresh the page",
                    variant: "destructive",
                  });
                }}
                onExpire={() => {
                  setCaptchaToken(null);
                  turnstileRef.current?.reset();
                }}
                className="mb-4"
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={loading || !acceptedTerms || !captchaToken}
            >
              {loading
                ? t("sending")
                : captchaToken
                ? t("sendCode")
                : t("verifying")}
            </Button>
          </form>
        )}
        {step === "otp" && (
          <>
            {loading ? (
              <Loading element="session" size="large" />
            ) : (
              <>
                <InputOTP
                  maxLength={6}
                  onComplete={(code: string) => {
                    setOtp(code);
                  }}
                >
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
                <Turnstile
                  ref={turnstileRef2}
                  siteKey={
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY! as string
                  }
                  onSuccess={(token: string) => setCaptchaToken(token)}
                  onError={() => {
                    toast({
                      title: "Error with security check",
                      description: "Please try again or refresh the page",
                      variant: "destructive",
                    });
                  }}
                  onExpire={() => {
                    setCaptchaToken(null);
                    turnstileRef2.current?.reset();
                  }}
                  className="mb-4"
                />
                <div className="flex justify-between w-full gap-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setOtpAttempts(0);
                      setOtp("");
                      setStep("email");
                    }}
                    variant="neutral"
                  >
                    {t("back")}
                  </Button>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={loading}
                    onClick={() => {
                      handleOTP(otp);
                    }}
                  >
                    {t("verify")}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
