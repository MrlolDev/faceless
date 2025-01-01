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
import { Button } from "../../ui/button";
import Link from "next/link";

interface PacksListProps {
  userId: string;
}

export default function PacksList({ userId }: PacksListProps) {
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
              Total cost:{" "}
              {pack.photos.reduce((acc, photo) => acc + photo.credits, 0)}{" "}
              credits
            </p>
          </CardContent>
          <CardFooter className="flex justify-between pt-0 mt-0">
            <Link href={`/app/packs/${pack.id}`}>
              <Button variant="default">Open in editor</Button>
            </Link>
            <Button variant="neutral" onClick={() => deletePack(pack.id)}>
              Delete pack
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
