import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@next/third-parties/google";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function GetCreditsDialog() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("getCreditsDialog");

  const handleClaimCode = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const response = await fetch("/api/codes/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to claim code");
      }

      toast({
        title: t("success"),
        description: t("youveReceivedCredits", {
          credits: data.credits,
        }),
      });
      sendGAEvent("event", "claim_code", {
        credits: data.credits,
      });
      setCode("");
      router.refresh();
    } catch (error) {
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : "Failed to claim code",
        variant: "destructive",
      });
      setError(t("invalidCode"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("needMoreCredits")}</DialogTitle>
        <DialogDescription>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p>{t("youCanGetMoreCreditsInThreeWays")}</p>
              <ol className="list-decimal ml-4">
                <li>
                  <Link
                    href="/app/credits"
                    className="text-main hover:underline"
                  >
                    {t("purchaseCredits")}
                  </Link>{" "}
                  {t("withVariousPaymentOptions")}
                </li>
                <li>{t("ratePhotosAndYouCanGetBonusCreditsForFree")}</li>
                <li>{t("contactMeForFreeCreditsThrough")}</li>
              </ol>
            </div>
            <div className="flex gap-2 mt-0 mb-2">
              <a
                href="https://twitter.com/mrloldev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-main hover:underline"
              >
                Twitter
              </a>
              <span>•</span>
              <a
                href="mailto:leo@turing.sh"
                className="text-main hover:underline"
              >
                Email
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com/in/leonardo-ollero"
                target="_blank"
                rel="noopener noreferrer"
                className="text-main hover:underline"
              >
                LinkedIn
              </a>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <p>{t("orRedeemACode")}</p>
              <div className="flex gap-2">
                <Input
                  placeholder={t("enterCode")}
                  value={code}
                  className={cn(error && "border-red-500")}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button onClick={handleClaimCode} disabled={loading || !code}>
                  {loading ? t("claiming") : t("claim")}
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
