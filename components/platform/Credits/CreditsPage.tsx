"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/platform/AppHeader";
import Loading from "@/components/Loading";
import ProductsList from "@/components/platform/Credits/ProductsList";
import { Reminders } from "../Reminders";

export default function CreditsPage() {
  const { user, signOut, credits, creditsData } = useAuth();

  if (!user) {
    return <Loading element="user" />;
  }

  if (!creditsData) {
    return <Loading element="credits" />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <Reminders />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-heading mb-8">Get More Credits</h1>
        <ProductsList credits={creditsData} />
      </main>
    </div>
  );
}
