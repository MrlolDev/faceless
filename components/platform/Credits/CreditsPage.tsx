"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/platform/AppHeader";
import Loading from "@/components/Loading";
import ProductsList from "@/components/platform/Credits/ProductsList";
import { Reminders } from "../Reminders";
import { useTranslations } from "next-intl";
export default function CreditsPage() {
  const { user, signOut, credits, creditsData } = useAuth();
  const t = useTranslations("credits");
  if (!user) {
    return <Loading fullScreen={true} element="user" />;
  }

  if (!creditsData) {
    return <Loading fullScreen={true} element="credits" />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <Reminders />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading mb-8">{t("getMoreCredits")}</h1>
        <ProductsList credits={creditsData} />
      </main>
    </div>
  );
}
