"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function CookieConsent() {
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
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies. Learn more in our{" "}
          <Link href="/privacy" className="text-main hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex gap-4">
          <Button onClick={acceptCookies} variant="default">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
