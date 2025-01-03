"use client";

import { AppHeader } from "../AppHeader";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";

export default function SuccessPage() {
  const { user, signOut, credits } = useAuth();
  const t = useTranslations("credits");
  if (!user) {
    return <Loading element="user" />;
  }
  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-heading">{t("thankYou")}</h1>
          <p className="text-lg font-base">
            {t("yourPurchaseIsBeingProcessed")}
          </p>
          <div className="pt-4">
            <Link href="/app">
              <Button>{t("returnToGenerator")}</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
