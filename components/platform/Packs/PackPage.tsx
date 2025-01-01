"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePack } from "@/hooks/use-pack";
import AppPage from "../Generator";
import Loading from "@/components/Loading";

export default function PackPage({ packId }: { packId: string }) {
  const { user } = useAuth();
  const { pack, loading } = usePack(packId);

  if (!user) {
    return <Loading element="user" />;
  }
  if (loading) {
    return <Loading element="pack" />;
  }

  if (!pack) {
    return <div>Pack not found</div>;
  }
  return <AppPage defaultPack={pack} />;
}
