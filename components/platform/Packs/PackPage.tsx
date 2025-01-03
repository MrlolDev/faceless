"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePack } from "@/hooks/use-pack";
import AppPage from "../Generator";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";

export default function PackPage({ packId }: { packId: string }) {
  const { user } = useAuth();
  const { pack, loading } = usePack(packId);
  const t = useTranslations("packs");

  if (!user) {
    return <Loading fullScreen={true} element="user" />;
  }
  if (loading) {
    return <Loading fullScreen={true} element="pack" />;
  }

  if (!pack) {
    return <div>{t("packNotFound")}</div>;
  }
  return <AppPage defaultPack={pack} />;
}
