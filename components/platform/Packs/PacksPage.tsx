"use client";

import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/use-auth";
import PacksList from "@/components/platform/Packs/PacksList";
import Loading from "@/components/Loading";

export default function PacksPage() {
  const { user, signOut, credits } = useAuth();

  if (!user) {
    return <Loading element="user" />;
  }

  return (
    <div className="min-h-screen bg-bg">
      <AppHeader user={user} signOut={signOut} credits={credits} />
      <main className="container mx-auto px-4 py-8">
        <PacksList userId={user.id} />
      </main>
    </div>
  );
}
