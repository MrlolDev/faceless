import { Pack, Photos } from "@/types/packs";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Rating from "./Rating";

interface PhotoCarouselProps {
  photos: Photos[];
  pack: Pack & { photos: Photos[] };
  updatePhoto: (photo: Photos) => void;
}

export default function PhotoCarousel({
  photos,
  pack,
  updatePhoto,
}: PhotoCarouselProps) {
  if (photos.length === 0) return null;

  return (
    <Carousel className="w-full  h-fit">
      <CarouselContent className="h-full w-full">
        <CarouselItem key={pack.id} className="h-full w-full">
          <div className="pt-0 px-[40px] h-[400px] w-full aspect-square flex flex-col items-center justify-start">
            <img
              src={pack.originPhoto}
              alt="Generated avatar"
              className="object-cover rounded-base border-2 border-border w-[300px] h-[300px] aspect-square"
            />
            <p className="text-sm font-base">Original photo</p>
          </div>
        </CarouselItem>
        {photos.map((photo) => (
          <CarouselItem key={photo.id} className="h-full w-full">
            <div className="pt-0 px-[40px] h-full w-full flex flex-col gap-4 items-center">
              <Image
                src={photo.imgUrl}
                alt="Generated avatar"
                className="object-cover rounded-base border-2 border-border w-[300px] h-[300px] aspect-square"
                width={200}
                height={200}
              />
              <Rating photo={photo} className="" updatePhoto={updatePhoto} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
      <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
    </Carousel>
  );
}
