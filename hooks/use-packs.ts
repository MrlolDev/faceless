import { useEffect, useState } from "react";
import { Pack, Photos } from "@/types/packs";

interface UsePacks {
  packs: (Pack & { photos: Photos[] })[];
  loading: boolean;
  error: Error | null;
}

export const usePacks = (userId: string): UsePacks => {
  const [packs, setPacks] = useState<(Pack & { photos: Photos[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        setLoading(true);
        // Fetch packs
        const packsResponse = await fetch(`/api/users/${userId}/packs`);
        const packsData = await packsResponse.json();

        // Fetch photos for each pack
        const packsWithPhotos = await Promise.all(
          packsData.map(async (pack: Pack & { photos: Photos[] }) => {
            const photosResponse = await fetch(`/api/packs/${pack.id}/photos`);
            const photos: Photos[] = await photosResponse.json();
            return { ...pack, photos };
          })
        );

        setPacks(packsWithPhotos);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch packs")
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPacks();
    }
  }, [userId]);

  return { packs, loading, error };
};
