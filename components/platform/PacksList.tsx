"use client";

import { Pack, Photos } from "@/types/packs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { usePacks } from "@/hooks/use-packs";
import PhotoCarousel from "./PhotoCarousel";
import { Button } from "../ui/button";

interface PacksListProps {
  userId: string;
  onOpenPack: (pack: Pack & { photos: Photos[] }) => void;
}

export default function PacksList({ userId, onOpenPack }: PacksListProps) {
  const { packs, loading, updatePhoto, deletePack } = usePacks(userId);

  if (loading) {
    return <div>Loading packs...</div>;
  }

  if (packs.length === 0) {
    return <div>No packs found. Generate your first pack!</div>;
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
              {pack.characterDescription}
            </p>
            <p className="text-sm font-base">
              Total cost: {pack.totalCost} credits
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 mt-0">
            <Button variant="default" onClick={() => onOpenPack(pack)}>
              Open in editor
            </Button>
            <Button variant="neutral" onClick={() => deletePack(pack.id)}>
              Delete pack
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
