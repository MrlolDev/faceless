"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePacks } from "@/hooks/use-packs";
import PhotoCarousel from "./PhotoCarousel";
import { Button } from "../../ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useTranslations } from "next-intl";

interface PacksListProps {
  userId: string;
}

export default function PacksList({ userId }: PacksListProps) {
  const { packs, loading, updatePhoto, deletePack } = usePacks(userId);

  const t = useTranslations("packs");
  if (loading) {
    return <Loading fullScreen={true} element="packs" size="large" />;
  }

  if (packs.length === 0) {
    return <div>{t("noPacks")}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map((pack, index) => (
        <Card key={pack.id} className="w-full">
          <CardHeader>
            <CardTitle>Pack {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 w-full">
            {pack.photos && pack.photos.length > 0 && (
              <PhotoCarousel
                photos={pack.photos}
                pack={pack}
                updatePhoto={updatePhoto}
              />
            )}
            <p className="text-sm font-base line-clamp-2 pt-0 mt-0">
              Created at: {new Date(pack.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm font-base">
              {t("totalCost")}:{" "}
              {pack.photos.reduce((acc, photo) => acc + photo.credits, 0)}{" "}
              {t("credits")}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 mt-0">
            <Link href={`/app/packs/${pack.id}`}>
              <Button variant="default">{t("openInEditor")}</Button>
            </Link>
            <Button variant="neutral" onClick={() => deletePack(pack.id)}>
              {t("deletePack")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
