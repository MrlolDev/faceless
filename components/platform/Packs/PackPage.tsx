"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePack } from "@/hooks/use-pack";
import AppPage from "../Generator";

export default function PackPage({ packId }: { packId: string }) {
  const { user, signOut, credits } = useAuth();
  const { pack, loading, error } = usePack(packId);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  if (!pack) {
    return <div>Pack not found</div>;
  }
  return <AppPage defaultPack={pack} />;
}
