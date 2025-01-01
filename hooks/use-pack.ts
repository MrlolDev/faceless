import { Pack, Photos } from "@/types/packs";
import { useEffect, useState } from "react";

export const usePack = (packId: string) => {
  const [pack, setPack] = useState<(Pack & { photos: Photos[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        setLoading(true);
        const pack = await getPack(packId);
        console.log(pack);
        setPack(pack);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch pack")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPack();
  }, []);

  const getPack = async (packId: string) => {
    const pack = await fetch(`/api/packs/${packId}`);
    const packData = (await pack.json()).data;
    const photos = await fetch(`/api/packs/${packId}/photos`);
    const photosData = await photos.json();
    return { ...packData, photos: photosData };
  };
  return { pack, loading, error };
};
