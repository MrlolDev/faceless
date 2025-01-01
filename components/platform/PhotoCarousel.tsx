import useEmblaCarousel from "embla-carousel-react";
import { Photos } from "@/types/packs";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import RatingBadge from "./RatingBadge";

interface PhotoCarouselProps {
  photos: Photos[];
}

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleRatePhoto = async (photoId: number, rating: number) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!response.ok) {
        throw new Error("Failed to rate photo");
      }

      // Update the local state to reflect the new rating
      const updatedPhotos = photos.map((photo) =>
        photo.id === photoId ? { ...photo, rating } : photo
      );
      // You'll need to implement a way to update the photos state in the parent component
    } catch (error) {
      console.error("Error rating photo:", error);
    }
  };

  if (photos.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square min-w-full">
              <RatingBadge
                rating={photo.rating}
                onRatingChange={(newRating) =>
                  handleRatePhoto(photo.id, newRating)
                }
              />
              <Image
                src={photo.imgUrl}
                alt="Generated avatar"
                fill
                className="object-cover rounded-base border-2 border-border"
              />
            </div>
          ))}
        </div>
      </div>
      {photos.length > 1 && (
        <>
          <Button
            variant="neutral"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="neutral"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
}
