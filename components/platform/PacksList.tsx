"use client";

import { useEffect, useState } from "react";
import { Pack, Photos } from "@/types/packs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { usePacks } from "@/hooks/use-packs";

interface PacksListProps {
  userId: string;
}

export default function PacksList({ userId }: PacksListProps) {
  const { packs, loading } = usePacks(userId);

  if (loading) {
    return <div>Loading packs...</div>;
  }

  if (packs.length === 0) {
    return <div>No packs found. Generate your first pack!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map((pack) => (
        <Card key={pack.id}>
          <CardHeader>
            <CardTitle>Pack {pack.id.slice(0, 8)}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square">
                <Image
                  src={pack.originPhoto}
                  alt="Original photo"
                  fill
                  className="object-cover rounded-base border-2 border-border"
                />
              </div>
              {pack.photos?.[0] && (
                <div className="relative aspect-square">
                  <Image
                    src={pack.photos[0].imgUrl}
                    alt="Generated avatar"
                    fill
                    className="object-cover rounded-base border-2 border-border"
                  />
                </div>
              )}
            </div>
            <p className="text-sm font-base line-clamp-2">
              {pack.characterDescription}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
