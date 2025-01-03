"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bw border-t-2 border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm font-base">
          {t("message")}{" "}
          <Link href="/privacy" className="text-main hover:underline">
            {t("privacyLink")}
          </Link>
          .
        </div>
        <div className="flex gap-4">
          <Button onClick={acceptCookies} variant="default">
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
